## Remediation Finding 20

**Status:** Fixed

**Fix date:** 2026-06-03

**What was changed:**

The update controller endpoints across six distinct models (`ads`, `events`, `lots`, `posts`, `preoffers`, `users`) were systematically hardened to introduce a critical Defense-in-depth validation layer, mitigating Mass Assignment vulnerabilities and schema-abuse risks.

- **Dual layered validation architecture:** The update controllers retain the existing structural array filtering (`allowedFields` with `Object.fromEntries`) to govern the allowed model parameters, while introducing an explicit Joi validation gate as an internal integrity checkpoint.

- **Schema constraint enforcement:** Input data types are strictly sanitized and evaluated prior to hitting database model setters.

- **Input hardening and regex constraints:** The profile update routing handles user nicknames using strict alphanumeric regex bounds (`/^[a-zA-Z0-9,.ñÁÉÍÓÚáéíóú ]*$/`) to dynamically isolate and neutralize structural characters used in malicious injection sequences.

**Files modified**

- `backend/src/controllers/ad/update.js`

- `backend/src/controllers/lot/update.js`

- `backend/src/controllers/post/update.js`

- `backend/src/controllers/user/update.js`

- `backend/src/controllers/event/update.js`

- `backend/src/controllers/preoffer/update.js`

**Code change:**

Showing structural representation of code remediation applied across the controllers. Example: `ad/update.js`

**Before**

```js
const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    adModel
        .findOne({ _id: request.params.id })
        .then(ad => {
            const allowedFields = ['title', 'position', 'imgUrl', 'link', 'published']
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            ad.set(updateData)
            ad.save().then(() => {
                response.status(200).json({
                    message: 'Ad updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the ad'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the ad'
            })
        })
}
```

**After**

```js
const Joi = require('joi')
const { adModel } = require('../../models/ad')

module.exports = (request, response) => {
    const schema = Joi.object({
        title: Joi.string()
            .optional()
            .min(2)
            .max(50),
        position: Joi.string()
            .optional()
            .min(2)
            .max(50),
        imgUrl: Joi.string()
            .optional()
            .min(2)
            .max(200),
        link: Joi.string()
            .allow(null, '')
            .optional()
            .min(2)
            .max(200),
        published: Joi.boolean()
            .optional()
    })

    const validationResult = schema.validate(request.body)
    if (validationResult.error) {
        return response.status(400).json({ 
            message: 'Invalid input data provided' 
        })
    }

    adModel
        .findOne({ _id: request.params.id })
        .then(ad => {
            const allowedFields = ['title', 'position', 'imgUrl', 'link', 'published']
            const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
                allowedFields.includes(key)
            ))

            ad.set(updateData)
            ad.save().then(() => {
                response.status(200).json({
                    message: 'Ad updated successfully'
                }).end()
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the ad'
                })
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to update the ad'
            })
        })
}
```

**Retest result:**

Targeted component verification and exception testing was conducted through an API testing environment to isolate and confirm the behavior of the newly instantiated runtime Joi validation gates.

Validation confirmed that:

- **Constraint validation enforcement:** Transmitting sub-length parameter modifications or exceeding text thresholds successfully tripped schema bounds, outputting a generic `400 Bad request` instead of propagating execution block.

- **Data typing rejection:** Supplying incompatible variables to strongly typed parameters resulted in immediate processing rejection at the runtime middleware border.

- **Injection payload containment:** Malicious structural entities and cross-site framing notation passed into sanitized attributes failed regular expression evaluations, dropping the request stream at the validation gate.

---

![update ad invalid input data](./screenshots/update%20ad%20invalid%20input%20data.jpg)

*Input validation control successfully intercepts a sub-length advertisement title modification and drops the payload with a generic 400 Bad Request error.*

![update event invalid input data](./screenshots/update%20event%20invalid%20input%20data.jpg)

*Event update validation gate safely blocks a request payload that exceeds the maximum allowed string character limit constraint.*

![update lot invalid input data](./screenshots/update%20lot%20invalid%20input%20data.jpg)

*Lot parameter endpoint drops an unauthenticated type-mismatched property modification, neutralizing a potential database mapping attack.*

![update post invalid input data](./screenshots/update%20post%20invalid%20input%20data.jpg)

*Post update integrity gate intercepts an out-of-bounds parameter, suppressing internal engine debugging stacks to mitigate information disclosure.*

![update preoffer invalid input data](./screenshots/update%20preoffer%20invalid%20input%20data.jpg)

*Preoffer controller validation forces strict type evaluation on boolean attributes, successfully dropping a malformed string payload.*

![update user invalid input data](./screenshots/update%20user%20invalid%20input%20data.jpg)

*User profile update regex sanitization isolates illegal special characters within a modified nickname field to intercept potential injection strings.*

