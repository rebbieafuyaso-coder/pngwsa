import { FaLightbulb, FaLocationArrow, FaRocket } from "react-icons/fa"

export const HeroData = {
  about: [
    {
      key: 1,
      imgSource: "/stem-students-wut-china.jpg",
      imgAlt: "stem-students-wut-china",
      title: "Know What We Do",
      smallTitle: "About Us",
      text: "Meet our dedicated leaders, read our values and find out more about what we do"
    }
  ],
  members: [
    {
      imgSource: "/pngwsa-members-celebration.jpg",
      imgAlt: "pngwsa-members-celebration",
      title: "Meet our Talented Members",
      smallTitle: "Members",
      text: "Members are the heart of this association and they are the ones that makes this association come alive everyday"
    }
  ],
  contact: [
    {
      imgSource: "",
      imgAlt: "",
      title: "",
      smallTitle: "",
      text: ""
    }
  ],
  login: [
    {
      imgSource: "",
      imgAlt: "",
      title: "",
      smallTitle: "",
      text: ""
    }
  ]
}

export const MissionCards = [
  {
    key: 1,
    title: "Vision",
    icon: <FaLightbulb />,
    text: "To be a united and dynamic community that empowers PNG students in Wuhan to exec acedmically, celebrate cultural heritage and become future leaders",
  },
  {
    key: 1,
    title: "Mission",
    icon: <FaRocket />,
    text: "To support the hostilic development of PNG students in Wuhan through acedemic collaboration, collaboration, cultural exchange, welfare assistance, and networking opportunitieswhile promoting Papua New Guinea's identity and values in china",
  },
  {
    key: 1,
    title: "Main Objective",
    icon: <FaLocationArrow />,
    text: "To create a support system that enhances the educational and cultural experience of PNG students in Wuhan, fostering their success and strenghtening ties between PNG and China",
  },
];



// galleryData.js
export const GalleryPreview = {
  //Academic & Education
  academic: [
    {
      id: 1,
      url: '/jemmimah-karl-and-bilu-kasanda-registration.jpg',
      category: "Academic and Educational",
      title: 'Registration 2025',
      event: 'Beginning of Year 2026 Registration',
      date: 'September 1, 2025',
      description: 'Getting students ready for a new academic year of 2026'
    }
  ],

  // Events & Celebrations
  events: [
    {
      id: 2,
      url: '/png-students-celebrating-independence.jpg',
      category: "Events and Celebrations",
      title: 'PNG Independance',
      event: 'Annual Independence Calabration in Wuhan',
      date: 'September 16, 2025',
      description: 'Students celebrating the independence here in Wuhan City China.'
    }
  ],
  // Community & Networking
  community: [
    {
      id: 3,
      url: '/png-ndoe-officers-visit-to-wut.jpg',
      category: "Community and Networking",
      title: 'PNG NDOE Officers',
      event: 'NDOE Officers Official first visit',
      date: 'August 08 , 2025',
      description: 'NDOE Officers securing a partnership to WUT to send in more PNG STEM Students in the future'
    }
  ],
  // Cultural Exchange
  cultural: [
    {
      id: 4,
      url: '/rebbie-afuyaso-and-fellow-students-chinese-new-year.jpg',
      category: "Cultural Exchange",
      title: 'PNG-China Food Festival',
      event: 'Food and Culture Exchange',
      date: 'February 12th, 2025',
      description: 'Students celebrating Chinese new year with chinese students and other international students strenghtening future collaborations.'
    }
  ],

  // Administrative & Official
  administrative: [
    {
      id: 5,
      url: '/png-students-and-chinese-proffessors.jpg',
      category: "Administration and Official",
      title: 'Scholarship Program Briefing',
      event: 'Partnership Established',
      date: 'August 5, 2025',
      description: 'STEM Officers partnering with PNG WSA and WUT to send in more STEM students to China.'
    }
  ],

  // Student Life
  lifestyle: [
    {
      id: 6,
      url: '/rebbie-afuyaso-and-png-students-in-wut.jpg',
      category: "Student Life",
      title: 'STEM Intake 2025',
      event: 'Campus Tour',
      date: 'September 1st, 2026',
      description: 'Students exploring the beautiful campus of the school and and its facilities.'
    }
  ]
};
  /**
   * Events Here
   */
export const upcomingEvents = [
      { 
        title: "PNG WSA Orientation 2026 - 2027",
        poster: "/events/png-wsa-orientation.png",
        date: "Aug 31, 2026",
        location: "Wuhan",
        description: `The PNG Wuhan Students Association (PNG WSA) warmly welcomes all new and returning members to the 2026-2027 academic year.
        Our Orientation Program is an opportunity to come together, meet fellow PNG students, exchange contacts, build new friendships, and strengthen our community in Wuhan.
        You’ll also get the chance to meet the PNG WSA Executive Team, learn more about the association, and hear about important agendas, activities, and plans for the new academic year.
        And of course, we’ll keep it relaxed and enjoyable with BBQ, outdoor activities, music, good food, and great company`,
        link: "png-wsa-orientation-bbq",
      },
    ];
