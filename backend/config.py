from backend.models import SiteConfiguration
from backend import db

# Configuration keys
NICETIES_OPEN = 'how long before batch end to start accepting niceties (datetime.timedelta)'
CLOSING_TIME = 'when on the day before end of batch to stop accepting niceties (datetime.time)'
CLOSING_BUFFER = 'how long before closing to pretend niceties are closed (datetime.timedelta)'
CACHE_TIMEOUT = 'default max age for cached data (datetime.timedelta)'
INCLUDE_FACULTY = 'permit niceties to be left about faculty (boolean)'
INCLUDE_RESIDENTS = 'permit niceties to be left about residents (boolean)'

# Memo table for get() memoization
memo = {}


def get(key, default=None, memoized=True):
    """Get a configuration value from the SiteConfiguration table, returning
    `default` if the value is not in the table. This value is memoized if it is
    retreived from the database, making repeated calls cheap. Memoization can be
    bypassed by passing `memoized=False` as a parameter."""
    if memoized and key in memo:
        return memo[key]
    db_row = SiteConfiguration.query.filter(SiteConfiguration.key == key).one_or_none()
    if db_row is None:
        return default
    memo[key] = db_row.value
    return memo[key]


def set(key, value):
    """Set a configuration value in the SiteConfiguration table."""
    db_row = SiteConfiguration.query.filter_by(key=key).one_or_none()
    if db_row is None:
        db_row = SiteConfiguration(key, value)
        db.session.add(db_row)
    else:
        db_row.value = value
    db.session.commit()
    memo[key] = value


def unset(key):
    """Remove a configuration value from the SiteConfiguration table."""
    if key in memo:
        del memo[key]
    (db
     .session
     .query(SiteConfiguration)
     .filter(key == key)
     .delete())
    db.session.commit()


def to_frontend_value(cfg):
    """Returns a JSON-serializable version of the value of the `SiteConfiguration`
    object `cfg`, applying any transformation reversed by from_frontend_value."""
    if cfg.key == NICETIES_OPEN:
        return cfg.value.total_seconds() / (60 * 60 * 24)
    elif cfg.key == CLOSING_TIME:
        return cfg.value.strftime('%H:%M')
    elif cfg.key == CLOSING_BUFFER:
        return cfg.value.total_seconds() / 60
    elif cfg.key == CACHE_TIMEOUT:
        return cfg.value.total_seconds()
    elif cfg.key == INCLUDE_FACULTY:
        return cfg.value
    elif cfg.key == INCLUDE_RESIDENTS:
        return cfg.value
    else:
        return None


def from_frontend_value(key, value):
    """Returns a `SiteConfiguration` object value for the relevant `key` and
    JSON-serializable `value`, applying any transformation reversed by to_frontend_value."""
    if key == NICETIES_OPEN:
        from datetime import timedelta
        return timedelta(days=value)
    elif key == CLOSING_TIME:
        from datetime import datetime
        return datetime.strptime(value, '%H:%M').time()
    elif key == CLOSING_BUFFER:
        from datetime import timedelta
        return timedelta(minutes=value)
    elif key == CACHE_TIMEOUT:
        from datetime import timedelta
        return timedelta(seconds=value)
    elif key == INCLUDE_FACULTY:
        return value
    elif key == INCLUDE_RESIDENTS:
        return value
    else:
        raise ValueError('No such config key!')


def set_to_default():
    import datetime
    set(NICETIES_OPEN, datetime.timedelta(days=14))
    set(CLOSING_TIME, datetime.time(18, 0))
    set(CLOSING_BUFFER, datetime.timedelta(minutes=30))
    set(CACHE_TIMEOUT, datetime.timedelta(days=7))
    set(INCLUDE_FACULTY, False)
    set(INCLUDE_RESIDENTS, False)
    db.session.commit()
