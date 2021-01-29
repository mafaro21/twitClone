var m = {
    $jsonSchema: {
        bsonType: 'object',
        required: [
            'fullname',
            'email',
            'password',
            'datejoined'
        ],
        properties: {
            fullname: {
                bsonType: 'string',
                description: 'must be a string',
                maxLength: 30
            },
            email: {
                bsonType: 'string',
                description: 'must be a valid email'
            },
            password: {
                bsonType: 'string',
                minLength: 8,
                description: 'must be at least 8 characters long'
            },
            datejoined: {
                bsonType: 'date',
                description: 'Must be a valid date'
            }
        }
    },
    $and: [{
            email: {
                $regex: '(^([0-9A-Za-z])[\\w\\.-]+@{1}[\\w]+\\.{1}[\\w]\\S+)$',
                $options: 'gi'
            }
        },
        {
            fullname: {
                $regex: '^([0-9A-Za-z])\\w+\\s{1}',
                $options: 'gi'
            }
        },
        {
            username: {
                $regex: '\\w+\\S+',
                $options: 'gi'
            }
        }
    ]
}