const { body, validationResult,param,query } = require('express-validator');
const {UserModel} = require('../models')
const asyncHandler = require('express-async-handler')
// Hàm validates nhận vào một đối tượng cấu hình các trường cần kiểm tra và thông báo lỗi
const validates = (fieldConfigs, source = 'body') => [
     // Tạo các kiểm tra cho từng trường cần thiết dựa trên cấu hình
     ...Object.entries(fieldConfigs).map(([field, { checks }]) => {
        let validatorChain = body(field);
        switch (source) {
            case 'params':
                validatorChain = param(field)
                break;
            case 'query':
                    validatorChain = query(field)
                break;
            default:
                validatorChain = body(field)
                break;
        }
        checks.forEach(check => {
            validatorChain = validatorChain.custom(async  (value, { req }) => {
                const result = await check.run({ [source]: { [field]: value } });
                if (!result.isEmpty()) {
                    throw new Error(result.errors[0].msg); // Lấy thông báo lỗi từ kiểm tra
                }
                return true;
            });
        });
        return validatorChain;
    }),

    // Kiểm tra các lỗi và trả về phản hồi lỗi nếu có
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                mes: 'Validation failed !!',
                errors: errors.array(),
            });
        }
        next();
    }
];


const distanceEventConfigsQuery = {
    lat: {
        checks: [
            query('lat').isNumeric().withMessage('lat must be a number'),
        ]
    },
    lng: {
        checks: [
            query('lng').isNumeric().withMessage('lng must be a number'),
        ]
    },
    distance: {
        checks: [
            query('distance').isNumeric().withMessage('distance must be a number'),
        ]
    }
};



const followersEventConfigsParams = {
    idEvent: {
        checks: [
            param('idEvent').isString().withMessage('idEvent must be a string'),
        ]
    },
};


const profileUserConfigsParams = {
    idUser: {
        checks: [
            param('idUser').isString().withMessage('idUser must be a string'),
        ]
    },
};


const eventByIdConfigsParams = {
    id: {
        checks: [
            param('id').isString().withMessage('id must be a string'),
        ]
    },
};

const profileEmailUserConfigsBody = {
    email: {
        checks: [
            body('email').isEmail().withMessage('email must be a email'),
        ]
    },
};


const sendInviteNotificationConfigsBody = {
    messageTitle: {
        checks: [
            body('messageTitle').isString().withMessage('messageTitle must be a string'),
        ]
    },
    messageBody: {
        checks: [
            body('messageBody').isString().withMessage('messageBody must be a string'),
        ]
    },
    idUsers: {
        checks: [
            body('idUsers').isArray().withMessage('idUsers must be an array'),
            body('idUsers.*').isString().withMessage('Each idUsers must be a string')
        ]
    },
    idEvent: {
        checks: [
            body('idEvent').isString().withMessage('idEvent must be a string'),
        ]
    },
};


const refreshTokenAuthConfigsBody = {
    refreshToken: {
        checks: [
            body('refreshToken').isString().withMessage('refreshToken must be a string'),
        ]
    },
};



const expoPushTokenUserConfigsBody = {
    expoPushToken: {
        checks: [
            body('expoPushToken').isString().withMessage('expoPushToken must be a string'),
        ]
    },
};


const postFollowUserConfigsBody = {
    idFollow: {
        checks: [
            body('idFollow').isString().withMessage('idFollow must be a string'),
        ]
    },
};


const profileInterestUserConfigsBody = {
    interests: {
        checks: [
            body('interests').isArray().withMessage('Interests must be an array'),
            body('interests.*').isString().withMessage('Each interests must be a string')
        ]
    },
};


const myProfileUserConfigsBody = {
    photoUrl: {
        checks: [
            body('photoUrl').isString().withMessage('photoUrl must be a string'),
        ]
    },
    familyName: {
        checks: [
            body('familyName').isString().withMessage('familyName must be a string'),
        ]
    },
    givenName: {
        checks: [
            body('givenName').isString().withMessage('givenName must be a string'),
        ]
    },
    fullName: {
        checks: [
            body('fullName').isString().withMessage('fullName must be a string'),
        ]
    },
    bio: {
        checks: [
            body('bio').isString().withMessage('bio must be a string'),
        ]
    },
};


// Cấu hình các trường cần kiểm tra và các hàm kiểm tra
const addEventConfigsBody = {
    authorId: {
        checks: [
            body('authorId').isString().withMessage('Author ID must be a string'),
        ]
    },
    categories: {
        checks: [
            body('categories').isArray().withMessage('Categories must be an array'),
            body('categories.*').isString().withMessage('Each Categories must be a string')
        ]
    },
    date: {
        checks: [
            body('date').isISO8601().withMessage('Date must be a valid ISO8601 date')
        ]
    },
  /*   description: {
        checks: [
            body('description').optional().isString().withMessage('Description must be a string')
        ]
    }, */
    endAt: {
        checks: [
            body('endAt').isISO8601().withMessage('EndAt must be a valid ISO8601 date')
        ]
    },
    imageUrl: {
        checks: [
            body('imageUrl').isURL().withMessage('ImageUrl must be a valid URL')
        ]
    },
    location: {
        checks: [
            body('location').isObject().withMessage('Location must be an object'),
            body('location.address').isString().withMessage('Location address must be a string'),
            body('location.title').isString().withMessage('Location title must be a string')
        ]
    },
    position: {
        checks: [
            body('position').isObject().withMessage('Position must be an object'),
            body('position.lat').isNumeric().withMessage('Position lat must be a number'),
            body('position.lng').isNumeric().withMessage('Position lng must be a number')
        ]
    },
    price: {
        checks: [
            body('price').isNumeric().withMessage('Price must be a number'),
            body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
        ]
    },
    startAt: {
        checks: [
            body('startAt').isISO8601().withMessage('StartAt must be a valid ISO8601 date')
        ]
    },
    title: {
        checks: [
            body('title').notEmpty().withMessage('Title is required'),
            body('title').isString().withMessage('Title must be a string')
        ]
    },
    // Kiểm tra startAt nhỏ hơn endAt
    customChecks: {
        checks: [
            body('startAt').custom((startAt, { req }) => {
                const endAt = req.body.endAt;
                if (new Date(startAt) >= new Date(endAt)) {
                    throw new Error('StartAt must be earlier than EndAt');
                }
                return true;
            })
        ]
    },
   /*  users: {
        checks: [
            body('users').isArray().withMessage('Users must be an array'),
            body('users.*').isString().withMessage('Each user must be a string')
        ]
    } */
};

const checkUser = asyncHandler( async (idUser) => {
    const userFind = await UserModel.findById(idUser)
    return userFind
})

module.exports = {
    validates,
    addEventConfigsBody,
    distanceEventConfigsQuery,
    followersEventConfigsParams,
    checkUser,
    expoPushTokenUserConfigsBody,
    profileUserConfigsParams,
    profileEmailUserConfigsBody,
    myProfileUserConfigsBody,
    profileInterestUserConfigsBody,
    refreshTokenAuthConfigsBody,
    postFollowUserConfigsBody,
    sendInviteNotificationConfigsBody,
    eventByIdConfigsParams
};
