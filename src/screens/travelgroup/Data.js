export const GROUP_DATA = [
  {
    groupImage: "no-image.jpg",
    groupMembers: [1],
    groupManagers: [3],
    travelPlans: [],
    status: 1,
    _id: "6052fee58f674d42eeb7cabf",
    id: 1,
    groupOwner: 2,
    createdAt: "2021-02-25T03:12:56.723Z",
    updatedAt: "2021-02-25T04:53:06.514Z",
    __v: 0,
    groupName: "2st Group",
  },
  {
    groupImage: "no-image.jpg",
    groupMembers: [1, 2],
    groupManagers: [4],
    travelPlans: [],
    status: 1,
    id: 2,
    _id: "6052feee8f674d42eeb7cac0",
    groupName: "3st group",
    groupOwner: 3,
    createdAt: "2021-03-15T15:30:24.243Z",
    updatedAt: "2021-03-15T15:30:24.243Z",
    __v: 0,
  },
  {
    id: 3,
    groupImage: "no-image.jpg",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "6052fef68f674d42eeb7cac1",
    groupName: "4st group",
    groupOwner: 4,
    createdAt: "2021-03-15T15:47:03.773Z",
    updatedAt: "2021-03-15T15:47:03.773Z",
    __v: 0,
  },
  {
    id: 4,
    groupImage: "no-image.jpg",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "6052feff8f674d42eeb7cac2",
    groupName: "5st group",
    groupOwner: 5,
    createdAt: "2021-03-15T15:49:48.489Z",
    updatedAt: "2021-03-15T15:49:48.489Z",
    __v: 0,
  },
  {
    id: 5,
    groupImage: "no-image.jpg",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "6052ff098f674d42eeb7cac3",
    groupName: "6st group",
    groupOwner: 6,
    createdAt: "2021-03-15T15:59:20.162Z",
    updatedAt: "2021-03-15T15:59:20.162Z",
    __v: 0,
  },
  {
    id: 6,

    groupImage: "no-image.jpg",
    groupMembers: [4, 3, 5],
    groupManagers: [2],
    travelPlans: [],
    status: 1,
    _id: "6052ff488f674d42eeb7cac4",
    groupName: "1st group",
    groupOwner: 1,
    createdAt: "2021-03-15T15:59:38.490Z",
    updatedAt: "2021-03-15T15:59:38.490Z",
    __v: 0,
  },
  {
    id: 7,
    groupName: "7th group",
    groupImage: "no-image.jpg",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "604f8472ff3fd9263b0fda41",
    groupOwner: 5,
    createdAt: "2021-03-15T15:59:46.915Z",
    updatedAt: "2021-03-15T15:59:46.915Z",
    __v: 0,
  },
  {
    id: 8,
    groupName: "8th group",
    groupImage: "no-image.jpg",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "604f8479ff3fd9263b0fda42",
    groupOwner: 5,
    createdAt: "2021-03-15T15:59:53.854Z",
    updatedAt: "2021-03-15T15:59:53.854Z",
    __v: 0,
  },
  {
    id: 9,
    groupName: "9th Group",
    groupImage: "my image",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    groupOwner: 1,
    createdAt: "2021-03-15T16:00:47.551Z",
    updatedAt: "2021-03-15T16:00:47.551Z",
    __v: 0,
  },
  {
    id: 10,
    groupName: "10th group",
    groupImage: "my image",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "604f84eb1580b0275269d50e",
    groupOwner: 2,
    createdAt: "2021-03-15T16:01:47.218Z",
    updatedAt: "2021-03-15T16:01:47.218Z",
    __v: 0,
  },
];

export const USER_DATA = [
  {
    id: 1,
    firstName: "Xiaoning",
    lastName: "Zhao",
    address: "123 Earth Ave, Solar, Universe",
    phone: "555-555-5555",
  },
  {
    id: 2,
    firstName: "Alex",
    lastName: "Zhang",
    address: "123 Earth Ave, Solar, Universe",
    phone: "555-555-5555",
  },
  {
    id: 3,
    firstName: "Tom",
    lastName: "Lee",
    address: "123 Earth Ave, Solar, Universe",
    phone: "555-555-5555",
  },
  {
    id: 4,
    firstName: "Algo",
    lastName: "Liu",
    address: "123 Earth Ave, Solar, Universe",
    phone: "555-555-5555",
  },
  {
    id: 5,
    firstName: "Joe",
    lastName: "Brad",
    address: "123 Earth Ave, Solar, Universe",
    phone: "555-555-5555",
  },
];

export const PlAN_DATA = [
  {
    id: 1,
    planName: "first plan",
    image: "url",
    planDescription: "first description",
    initiator: 1,
    travelGroup: 1,
    likes: [1, 2, 3],
    dislikes: [4],
    status: 4,
    comments: [
      {
        user: 1,
        text: "good",
        name: "bob",
        date: "03/16/2021",
      },
    ],
    departureAddress: "placdId1",
    destinationAddress: ["placeId2", "placeId3"],
  },

  {
    id: 2,
    planName: "2th plan",
    image: "url",
    planDescription: "2th description",
    initiator: 2,
    travelGroup: 1,
    likes: [1, 2, 3, 5],
    dislikes: [],
    status: 4,
    comments: [
      {
        user: 2,
        text: "good",
        name: "bob",
        date: "03/16/2021",
      },
    ],
    departureAddress: "placdId1",
    destinationAddress: ["placeId2", "placeId3"],
  },
];
