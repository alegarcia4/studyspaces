
export interface StudySpot {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  hours: string;
  distance: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: Review[];
  submittedBy: string;
  submittedDate: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export const studySpots: StudySpot[] = [
  {
    id: "1",
    name: "Pollak Library",
    address: "800 N State College Blvd, Fullerton, CA 92831",
    coordinates: { lat: 33.8818, lng: -117.8856 },
    description: "CSUF's main library features six floors of study spaces, computer labs, group study rooms, and extensive research resources. Popular for both quiet individual study and group projects.",
    hours: "7:00 AM - 12:00 AM (Mon-Thu), 7:00 AM - 5:00 PM (Fri), 10:00 AM - 5:00 PM (Sat), 12:00 PM - 12:00 AM (Sun)",
    distance: "0.2 miles",
    images: [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1534357808625-fdbecdd0b6da?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Power Outlets", "Quiet Zones", "Group Study Rooms", "Computer Labs", "Restrooms"],
    rating: 4.7,
    reviews: [
      {
        id: "r1",
        user: "Alex M.",
        rating: 5,
        comment: "The fifth floor quiet zone is perfect for finals week cramming. Plenty of outlets and the wifi is reliable.",
        date: "2025-03-15"
      },
      {
        id: "r2",
        user: "Jamie L.",
        rating: 4,
        comment: "Great study spot but gets very crowded during midterms and finals. Come early to get a good spot!",
        date: "2025-03-01"
      },
      {
        id: "r3",
        user: "Chris T.",
        rating: 5,
        comment: "Love the group study rooms - just make sure to reserve them ahead of time. The 24-hour study space during finals is a lifesaver.",
        date: "2025-02-22"
      }
    ],
    submittedBy: "Taylor",
    submittedDate: "2025-01-10"
  },
  {
    id: "2",
    name: "TSU (Titan Student Union)",
    address: "800 N State College Blvd, Fullerton, CA 92834",
    coordinates: { lat: 33.8825, lng: -117.8872 },
    description: "A vibrant campus hub with numerous study spaces, food options, and a relaxed atmosphere. Features outdoor patios, lounges, and private study rooms that can be reserved.",
    hours: "7:00 AM - 10:00 PM (Mon-Fri), 9:00 AM - 6:00 PM (Sat-Sun)",
    distance: "0.4 miles",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1565711561500-49678a10a63f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Power Outlets", "Food & Coffee", "Restrooms", "Group Study Rooms"],
    rating: 4.5,
    reviews: [
      {
        id: "r3",
        user: "Morgan P.",
        rating: 5,
        comment: "My favorite place to study on campus! Starbucks downstairs, comfortable seating, and great atmosphere.",
        date: "2025-03-20"
      },
      {
        id: "r4",
        user: "Sam H.",
        rating: 4,
        comment: "Good mix of social and quiet study spaces. The food court makes it convenient for longer study sessions.",
        date: "2025-02-25"
      }
    ],
    submittedBy: "Jordan",
    submittedDate: "2025-01-15"
  },
  {
    id: "3",
    name: "Night Owl Cafe",
    address: "2970 E Chapman Ave, Fullerton, CA 92831",
    coordinates: { lat: 33.8738, lng: -117.8714 },
    description: "Popular off-campus coffee shop with late hours, perfect for night owls. Features ample seating, specialty drinks, and pastries in a cozy atmosphere.",
    hours: "6:00 AM - 12:00 AM",
    distance: "1.2 miles",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526723038554-b4e37f2c2d85?q=80&w=2829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Power Outlets", "Coffee & Snacks", "Quiet Environment", "Late Hours"],
    rating: 4.6,
    reviews: [
      {
        id: "r5",
        user: "Casey R.",
        rating: 5,
        comment: "Best coffee near campus and the tables in the back are perfect for studying. They don't mind if you stay for hours!",
        date: "2025-03-10"
      },
      {
        id: "r6",
        user: "Riley J.",
        rating: 4,
        comment: "Great atmosphere and coffee, but it can get crowded during peak hours. Their lavender latte is amazing!",
        date: "2025-02-28"
      }
    ],
    submittedBy: "Quinn",
    submittedDate: "2025-01-20"
  },
  {
    id: "4",
    name: "Mihaylo Hall Study Rooms",
    address: "800 N State College Blvd, Fullerton, CA 92831",
    coordinates: { lat: 33.8786, lng: -117.8828 },
    description: "Modern business school building with dedicated study areas, collaborative spaces, and technology-enabled classrooms available when not in use.",
    hours: "7:00 AM - 10:00 PM (Mon-Fri), 9:00 AM - 5:00 PM (Sat), Closed (Sun)",
    distance: "0.3 miles",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Power Outlets", "Whiteboards", "Group Tables", "Modern Facilities"],
    rating: 4.8,
    reviews: [
      {
        id: "r7",
        user: "Taylor K.",
        rating: 5,
        comment: "The best place on campus for business students. Clean, quiet, and plenty of space to spread out your work.",
        date: "2025-03-18"
      },
      {
        id: "r8",
        user: "Jordan M.",
        rating: 5,
        comment: "The Bloomberg terminals and other tech resources make this place invaluable for finance projects.",
        date: "2025-03-05"
      }
    ],
    submittedBy: "Alex",
    submittedDate: "2025-01-25"
  },
  {
    id: "5",
    name: "Fullerton Public Library",
    address: "353 W Commonwealth Ave, Fullerton, CA 92832",
    coordinates: { lat: 33.8701, lng: -117.9273 },
    description: "Spacious public library with dedicated study areas, free WiFi, and a quiet atmosphere. Located in downtown Fullerton with nearby dining options.",
    hours: "10:00 AM - 7:00 PM (Mon-Thu), 10:00 AM - 5:00 PM (Fri-Sat), 1:00 PM - 5:00 PM (Sun)",
    distance: "2.7 miles",
    images: [
      "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2615&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2590&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Power Outlets", "Quiet Zones", "Study Rooms", "Restrooms"],
    rating: 4.6,
    reviews: [
      {
        id: "r9",
        user: "Jamie S.",
        rating: 5,
        comment: "Nice change of pace from campus libraries. Friendly staff and less crowded during finals week.",
        date: "2025-03-22"
      },
      {
        id: "r10",
        user: "Robin T.",
        rating: 4,
        comment: "Great atmosphere and plenty of quiet corners. The only downside is limited parking during busy times.",
        date: "2025-03-12"
      }
    ],
    submittedBy: "Morgan",
    submittedDate: "2025-01-30"
  }
];
