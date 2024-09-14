import { body, validationResult } from "express-validator";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  return res.status(400).json({
    success: false,
    message: errorMessages,
  });
};

const signUpValidator = () => [
  body("name").notEmpty().withMessage("Please enter your name").trim().escape(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one special character, and one lowercase letter"
    ),

  body("phone")
    .notEmpty()
    .withMessage("Please provide a valid phone number")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long"),

  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Please provide a valid gender"),

  body("address")
    .notEmpty()
    .withMessage("Please provide your address")
    .trim()
    .escape(),

  body("city")
    .notEmpty()
    .withMessage("Please provide your city")
    .trim()
    .escape(),

  body("state")
    .notEmpty()
    .withMessage("Please provide your state")
    .trim()
    .escape(),

  body("pinCode")
    .notEmpty()
    .withMessage("Please provide a valid pin code")
    .isPostalCode("IN")
    .withMessage("Please provide a valid pin code"),

  body("country")
    .notEmpty()
    .withMessage("Please provide your country")
    .trim()
    .escape(),
];

const serviceValidator = () => [
  body("services.*.name")
    .notEmpty()
    .withMessage("Service name is required")
    .trim()
    .escape(),

  body("services.*.price")
    .notEmpty()
    .withMessage("Service price is required")
    .isFloat({ gt: 0 })
    .withMessage("Service price must be a number greater than 0"),
];

const ownerSignUpValidator = () => [
  body("centerName")
    .notEmpty()
    .withMessage("Please enter the clinic center name")
    .trim()
    .escape(),

  body("name").notEmpty().withMessage("Please enter your name").trim().escape(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one special character, and one lowercase letter"
    ),

  body("phone")
    .notEmpty()
    .withMessage("Please provide a valid phone number")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long"),

  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Please provide a valid gender"),

  body("website")
    .notEmpty()
    .withMessage("Please provide a valid website URL")
    .isURL()
    .withMessage("Please provide a valid website URL"),

  body("startWeek")
    .notEmpty()
    .withMessage("Please provide the start of the week")
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Start week must be a valid day of the week")
    .trim(),

  body("endWeek")
    .notEmpty()
    .withMessage("Please provide the end of the week")
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Start week must be a valid day of the week"),

  body("startTime").notEmpty().withMessage("Please provide the start time"),

  body("endTime").notEmpty().withMessage("Please provide the end time"),

  body("category").notEmpty().withMessage("Please provide the category"),

  body("numberOfAppointments")
    .isInt({ min: 1, max: 10 })
    .withMessage("The number of appointments must be between 1 and 10"),

  body("googleMapLink")
    .notEmpty()
    .withMessage("Please provide a valid Google Maps link")
    .isURL()
    .withMessage("Please provide a valid Google Maps link"),

  serviceValidator(),

  body("address")
    .notEmpty()
    .withMessage("Please provide your address")
    .trim()
    .escape(),

  body("city")
    .notEmpty()
    .withMessage("Please provide your city")
    .trim()
    .escape(),

  body("state")
    .notEmpty()
    .withMessage("Please provide your state")
    .trim()
    .escape(),

  body("pinCode")
    .notEmpty()
    .withMessage("Please provide a valid pin code")
    .isPostalCode("IN")
    .withMessage("Please provide a valid pin code"),

  body("country")
    .notEmpty()
    .withMessage("Please provide your country")
    .trim()
    .escape(),
];

const signInValidator = () => [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Please enter your password").trim(),
];

const userUpdateValidator = () => [
  body("name", "Please enter your name").trim().escape(),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long"),

  body("address", "Please provide your address").trim().escape(),
  body("city", "Please provide your city").trim().escape(),
  body("state", "Please provide your state").trim().escape(),
  body("pinCode", "Please provide a valid pin code")
    .optional()
    .isPostalCode("IN"),
  body("country", "Please provide your country").trim().escape(),
];

const proUserUpdateValidator = () => [
  body("centerName", "Please enter your center's name").trim().escape(),
  body("name", "Please enter your name").trim().escape(),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long"),

  body("website", "Please provide a valid website URL")
    .trim()
    .optional()
    .isURL(),
  body("googleMapLink", "Please provide a valid Google Maps link")
    .optional()
    .trim()
    .isURL(),
  body("startWeek", "Please provide a valid start week")
    .optional()
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
  body("endWeek", "Please provide a valid end week")
    .optional()
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
  body("startTime", "Please provide a valid start time").optional(),
  body("endTime", "Please provide a valid end time").optional(),
  body("services", "Please provide valid services").optional().isArray(),
  body("address", "Please provide your address").trim().escape(),
  body("city", "Please provide your city").trim().escape(),
  body("state", "Please provide your state").trim().escape(),
  body("pinCode", "Please provide a valid pin code")
    .optional()
    .isPostalCode("IN"),
  body("country", "Please provide your country").trim().escape(),
];

const contactValidator = () => [
  body("name").notEmpty().withMessage("Please enter your name").trim().escape(),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("subject")
    .notEmpty()
    .withMessage("Please enter the subject")
    .trim()
    .escape(),

  body("message")
    .notEmpty()
    .withMessage("Please enter your message")
    .trim()
    .escape(),
];

const reviewValidator = () => [
  body("review")
    .notEmpty()
    .withMessage("Please enter your review")
    .trim()
    .escape(),

  body("rating")
    .notEmpty()
    .withMessage("Please enter a rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5")
    .trim(),
];

const appointmentValidator = () => [
  body("service").notEmpty().withMessage("Please enter the service").trim(),

  body("date").notEmpty().withMessage("Please enter the date").trim(),

  body("time").notEmpty().withMessage("Please enter the time").trim(),

  body("status")
    .optional()
    .isIn(["Pending", "Cancelled", "Ongoing", "Rejected", "Completed"])
    .withMessage("Invalid status"),
];

const staffValidator = () => [
  body("username").notEmpty().withMessage("Name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits long"),

  body("date").notEmpty().withMessage("Date is required").trim(),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["Full Time", "Part Time"])
    .withMessage("Type must be either Full Time or Part Time"),
];

export {
  validateHandler,
  signUpValidator,
  ownerSignUpValidator,
  signInValidator,
  userUpdateValidator,
  proUserUpdateValidator,
  contactValidator,
  reviewValidator,
  appointmentValidator,
  staffValidator,
};
