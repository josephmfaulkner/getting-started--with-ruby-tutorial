if Current.user
  json.user do
    json.partial! "api/users/user", user: Current.user
  end
else
  json.user nil
end
# Rails may rotate the CSRF token when the session changes; the React app uses this one from now on
json.csrf_token form_authenticity_token
