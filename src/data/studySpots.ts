
export interface StudySpot {
  id: string;
  name: string;
  address: string;
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
    name: "Moonlight Cafe",
    address: "123 College Ave, University City",
    description: "A cozy cafe with a quiet upstairs area perfect for late-night study sessions. Free WiFi and plenty of outlets.",
    hours: "7:00 AM - 2:00 AM",
    distance: "0.5 miles",
    images: [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1534357808625-fdbecdd0b6da?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Power Outlets", "Coffee & Snacks", "Restrooms", "Quiet Zone"],
    rating: 4.7,
    reviews: [
      {
        id: "r1",
        user: "Alex",
        rating: 5,
        comment: "This place is a lifesaver for late-night cramming! Great atmosphere and the staff are super friendly even at 1 AM.",
        date: "2025-03-15"
      },
      {
        id: "r2",
        user: "Jamie",
        rating: 4,
        comment: "Love the quiet upstairs area. Only giving 4 stars because it gets pretty crowded during finals week.",
        date: "2025-03-01"
      }
    ],
    submittedBy: "Taylor",
    submittedDate: "2025-01-10"
  },
  {
    id: "2",
    name: "The Study Hub",
    address: "450 University Blvd, Campus East",
    description: "A 24/7 student-run space with private study rooms and a collaborative common area. Student ID required for entry after 10 PM.",
    hours: "24/7",
    distance: "1.2 miles",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Private Rooms", "Whiteboard", "Printer", "24/7 Access"],
    rating: 4.9,
    reviews: [
      {
        id: "r3",
        user: "Morgan",
        rating: 5,
        comment: "The private study rooms are amazing for group projects! I love that it's open 24/7.",
        date: "2025-03-20"
      },
      {
        id: "r4",
        user: "Sam",
        rating: 5,
        comment: "Best spot for pulling all-nighters. Security makes it feel safe even at 3 AM.",
        date: "2025-02-25"
      }
    ],
    submittedBy: "Jordan",
    submittedDate: "2025-01-15"
  },
  {
    id: "3",
    name: "Bookworm Lounge",
    address: "78 Scholar Street, Downtown",
    description: "A quiet bookstore with dedicated study tables and a small cafe. Great for deep focus sessions.",
    hours: "8:00 AM - 10:00 PM",
    distance: "2.3 miles",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526723038554-b4e37f2c2d85?q=80&w=2829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["Free WiFi", "Coffee Bar", "Quiet Environment", "Natural Lighting"],
    rating: 4.5,
    reviews: [
      {
        id: "r5",
        user: "Casey",
        rating: 5,
        comment: "The atmosphere is perfect for reading and studying. Love the coffee options too!",
        date: "2025-03-10"
      },
      {
        id: "r6",
        user: "Riley",
        rating: 4,
        comment: "Great spot but closes a bit early for night owls like me.",
        date: "2025-02-28"
      }
    ],
    submittedBy: "Quinn",
    submittedDate: "2025-01-20"
  },
  {
    id: "4",
    name: "Tech Commons",
    address: "200 Innovation Way, Tech District",
    description: "A modern coworking space that offers free access to students. High-speed internet and comfortable workstations.",
    hours: "6:00 AM - 12:00 AM",
    distance: "3.1 miles",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1565711561500-49678a10a63f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: ["High-Speed WiFi", "Ergonomic Chairs", "Meeting Rooms", "Free Coffee", "Printing Services"],
    rating: 4.8,
    reviews: [
      {
        id: "r7",
        user: "Taylor",
        rating: 5,
        comment: "The fastest wifi I've found for studying! The modern setup helps me stay focused.",
        date: "2025-03-18"
      },
      {
        id: "r8",
        user: "Jordan",
        rating: 4,
        comment: "Love this place for productivity, but it can get busy during weekdays.",
        date: "2025-03-05"
      }
    ],
    submittedBy: "Alex",
    submittedDate: "2025-01-25"
  }
];
