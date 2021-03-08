[RC API reference](https://github.com/recursecenter/wiki/wiki/Recurse-Center-API)

#### Login
`auth.authorized()`
- `rc.get(‘profiles/me’).data` (RC API)
- Retrieves or creates `User(id, name, avatar_url, is_faculty)` -> db
- `session[‘rc_token’], session[‘user_id’]` created

#### Menu
`App.render()`
- ```
if (this.state.selfInfo.admin === true) {
      adminMenu = (<MenuItem eventKey="admin">Admin</MenuItem>);
}
```

selfInfo: `App.loadSelfInfo`
- `/api/v1/self`
- returns `{‘admin’: util.admin_access(user)}`

`<Nav activeKey={this.state.currentview}`
- initialized to “write-niceties”, updated via handleSelect

### Write Niceties
#### SaveButton
noSave: Person.state.noSave

onClick: Person.saveAllComments
- `/api/v1/save-niceties` POST
- data = {'niceties': [{'target_id', 'end_date', 'anonymous', 'text', 'no_read', 'date_updated'}...]}
- Nicety.query.filter_by(end_date=end_date, target_id=n.get("target_id"), author_id=current_user().id) -> if not found, create new Nicety; update nicety; save to db
- 'end_date' suggests handling of multiple niceties for the same author & recipient?

#### People
people: `App.loadPeopleFromServer`
- `/api/v1/people`
- returns `{‘staying’, ‘leaving’, ‘special’, ‘faculty’}`
    - get_current_users
        - cache_people_call(batch[‘id]) -> partition_current_users
    - get_current_faculty
        - cache_person_call(‘id’), {‘is_faculty’: True}
    - 'special' is hardcoded

fromMe: `App.loadNicetiesFromMe`
- `/api/v1/niceties-from-me`
- `Nicety.query.filter(author_id == user_id)`
- returns `{'target_id', 'text', 'anonymous', 'no_read', 'date_updated'}`


#### PeopleRow
`fromMe: People.props.fromMe`

`data: People.generateRows(people.leaving/staying/faculty)`

#### Person
`fromMe: PeopleRow.props.fromMe`

`data: PeopleRow.props.data[0]`

`getInitialState: {'textValue', 'checkValue', 'noReadValue'}`

`updateSave`: populates `updated_niceties` (cf. `People.saveAllComments`)

`render: data.avatar_url, data.name, data.placeholder`

### Niceties About You
#### NicetyDisplay
niceties: `App.loadNicetiesForMe`
- `/api/v1/niceties-for-me`
- `Nicety.query.filter(Nicety.target_id == current_user().id)`
- returns `{'end_date', 'anonymous', 'text', 'no_read', 'date_updated'}` if anon, `{"avatar_url", "name", "author_id"}` in addition else

#### NicetyRow
`data: NicetyDisplay.props.niceties[0]`

#### Nicety
`data: NicetyRow.props.data[0]`

### Admin
#### Admin
- `/api/v1/admin-edit-niceties` GET
- `Nicety.query` for data within the current 6 weeks
- returns `[{'to_name', 'to_id', 'niceties': [{'author_id', 'name', 'no_read', 'reviewed', 'text'}...]}...]`

#### AdminNicety
nicety: Admin.state.niceties[0].niceties[0]

target_id: Admin.state.niceties[0].to_id
- `/api/v1/admin-edit-niceties` POST
- data: text, author_id, target_id, faculty_reviewed
- Nicety.query(author_id == author_id, target_id == target_id) -> update text, faculty_reviewed; commit to db

#### App
