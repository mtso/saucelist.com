# savor

## TODO
- add pagination to API
- implement UI
  - frontpage
  x login
  - about?
  - hamburger menu
  x "open in Yelp" for location link
  - add submission page
  - add moderation
- add analytics
x add fb login
x add google login
- add windows login
- add instagram login
x server-side render for SEO

## ID users by IP address and cookie..?

## API

GET /api/foodstuff
{
  restaurant: 'Burger King',
  name: 'Zesty Dipping Sauce',
  tags: [
    'tangy',
    'sour',
    'garlic',
    'sweet'
  ],
  created_at: 'tz',
  updated_at: 'tz',
  savor_count: 345,
  user_savor_count: 12
}

GET /api/foodstuff?tag=tart,tangy

POST /api/foodstuff
{
  "location": "Burger King",
  "name": "Zesty Dipping Sauce"
}

POST /api/foodstuff/:id/savor
{
  "ok": true
}

Status 402
{
  "ok": false,
  "message": "You have reached max likes for this foodstuff"
}

POST /api/foodstuff/:id/tag
{
  "text": "tart"
}

tw
gl
gh
mt

User {
  auth_id: "fb-12232131",
  savors: [
    {
      "
    }
  ],
  savor_count
}

Foodstuff {
  location
  name
  tags
  savor_count
}

Tag {
  text
  foodstuff_id
  user_id
  $compound_index_unique: {foodstuff_id, user_id}
}

Savor {
  count
  foodstuff_id
  user_id
  $compound_index_unique: {foodstuff_id, user_id}
}

## Component Arch

- SauceList container fetches data and maintains array of sauce objects
- 
