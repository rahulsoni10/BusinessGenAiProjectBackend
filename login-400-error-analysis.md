# Login 400 Bad Request Error Analysis

## Root Cause
The `/api/users/login` endpoint uses validation middleware that requires:
- **Email**: Valid email format (checked by `isEmail()`)
- **Password**: Non-empty string (checked by `notEmpty()`)

## Validation Middleware Location
- File: `middleware/validation.js`
- Applied in: `routes/user/index.js`

## Common Issues Causing 400 Errors

1. **Invalid email format** - Frontend sending emails without '@' or invalid format
2. **Empty/missing password** - Frontend sending empty string or missing password field
3. **Missing Content-Type header** - Request not sent as `application/json`
4. **Malformed JSON** - Sending JavaScript object instead of stringified JSON

## Expected Request Format
```json
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "validpassword"
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-input",
      "msg": "Error message",
      "path": "fieldname",
      "location": "body"
    }
  ]
}
```

## Solution
Check frontend code for:
1. Proper email validation before sending
2. Non-empty password field
3. Correct headers (`Content-Type: application/json`)
4. Proper JSON stringification (`JSON.stringify()`)