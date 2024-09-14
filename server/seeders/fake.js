import { faker, simpleFaker } from "@faker-js/faker";
import { User } from "../models/userModel.js";
import { ProUser } from "../models/proUserModel.js";
import { Review } from "../models/reviewModel.js";

const createUser = async (numUsers) => {
  try {
    const userPromises = [];

    for (let i = 0; i < numUsers; i++) {
      const fakeAvatar = {
        url: faker.image.avatar(),
        public_id: faker.datatype.uuid(),
      };

      const numericPhone = parseInt(
        faker.phone.number().replace(/\D/g, ""),
        10
      );
      const numericPinCode = parseInt(
        faker.address.zipCode().replace(/\D/g, ""),
        10
      );

      const user = User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "password",
        phone: numericPhone,
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        pinCode: numericPinCode,
        country: faker.address.country(),
        avatar: fakeAvatar,
      });

      userPromises.push(user);
    }

    await Promise.all(userPromises);
    console.log("Users created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
};

const createProUser = async (numUsers) => {
  try {
    const userPromises = [];

    const citiesByState = {
      "Uttar Pradesh": [
        "Agra",
        "Aligarh",
        "Amroha",
        "Ayodhya",
        "Azamgarh",
        "Bahraich",
        "Ballia",
        "Banda",
        "Bara Banki",
        "Bareilly",
        "Basti",
        "Bijnor",
        "Bithur",
        "Budaun",
        "Bulandshahr",
        "Deoria",
        "Etah",
        "Etawah",
        "Faizabad",
        "Farrukhabad-cum-Fatehgarh",
        "Fatehpur",
        "Fatehpur Sikri",
        "Ghaziabad",
        "Ghazipur",
        "Gonda",
        "Gorakhpur",
        "Hamirpur",
        "Hardoi",
        "Hathras",
        "Jalaun",
        "Jaunpur",
        "Jhansi",
        "Kannauj",
        "Kanpur",
        "Lakhimpur",
        "Lalitpur",
        "Lucknow",
        "Mainpuri",
        "Mathura",
        "Meerut",
        "Mirzapur-Vindhyachal",
        "Moradabad",
        "Muzaffarnagar",
        "Partapgarh",
        "Pilibhit",
        "Prayagraj",
        "Rae Bareli",
        "Rampur",
        "Saharanpur",
        "Sambhal",
        "Shahjahanpur",
        "Sitapur",
        "Sultanpur",
        "Tehri",
        "Varanasi",
      ],
      Uttarakhand: [
        "Almora",
        "Dehra Dun",
        "Haridwar",
        "Mussoorie",
        "Nainital",
        "Pithoragarh",
      ],
    };

    const categories = [
      "Salon & Beauty",
      "Medical",
      "Financial Advisor",
      "Legal Services",
      "Tattoo/Piercing Studio",
      "Automotive",
      "Fitness & Wellness",
      "Counselor/Therapist",
      "Driving Instructor",
      "Home Services",
      "Pet Care",
    ];

    const states = Object.keys(citiesByState);

    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    for (let i = 0; i < numUsers; i++) {
      // Randomly select a state
      const randomState = states[Math.floor(Math.random() * states.length)];
      // Randomly select a city from the selected state
      const randomCity =
        citiesByState[randomState][
          Math.floor(Math.random() * citiesByState[randomState].length)
        ];
      // Randomly select a category
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const fakeImage = {
        url: faker.image.url(),
        public_id: faker.string.uuid(),
      };

      const fakeServices = [
        {
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
        },
        {
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
        },
      ];

      // Generate random hours and minutes
      const randomStartHour = faker.number.int({ min: 0, max: 23 });
      const randomStartMinute = faker.number.int({ min: 0, max: 59 });
      const randomEndHour = faker.number.int({ min: 0, max: 23 });
      const randomEndMinute = faker.number.int({ min: 0, max: 59 });

      const startTime = formatTime(randomStartHour, randomStartMinute);
      const endTime = formatTime(randomEndHour, randomEndMinute);

      const user = ProUser.create({
        centerName: faker.company.name(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "Suraj312001*",
        phone: parseInt(faker.phone.number().replace(/\D/g, ""), 10),
        gender: "male",
        website: faker.internet.url(),
        startWeek: faker.date.weekday(),
        endWeek: faker.date.weekday(),
        startTime: startTime,
        endTime: endTime,
        numberOfAppointments: faker.number.int({ min: 1, max: 10 }), // Random appointments count
        googleMapLink: faker.internet.url(),
        category: randomCategory, // Randomly selected category
        image: fakeImage,
        services: fakeServices,
        address: faker.address.streetAddress(),
        city: randomCity,
        state: randomState,
        pinCode: parseInt(faker.address.zipCode().replace(/\D/g, ""), 10),
        country: "India", // Fixed country as per your sample
      });

      userPromises.push(user);
    }

    await Promise.all(userPromises);
    console.log("Pro users created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating pro users:", error);
    process.exit(1);
  }
};

const createReview = async (numReviews) => {
  try {
    const proUserId = "66ae3055e99d02633e0f4588";

    const reviews = [];

    for (let i = 0; i < numReviews; i++) {
      const review = {
        rating: faker.datatype.number({ min: 1, max: 5 }),
        review: faker.lorem.sentence(),
        receiverId: proUserId,
        senderId: "66ae06536982df57224e52ba",
      };
      reviews.push(review);
    }

    await Review.insertMany(reviews);

    console.log(`${numReviews} reviews have been added successfully.`);
  } catch (error) {
    console.error("Error seeding reviews:", error);
  }
};

export { createUser, createProUser, createReview };
