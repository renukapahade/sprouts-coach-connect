import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Sample coaches data with Indian names (abbreviated for API route)
    const coaches = [
      {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91-9876543210",
        specialization: "fitness",
        bio: "Certified personal trainer with 8 years of experience in strength training, weight loss, and functional fitness. I specialize in creating personalized workout plans that fit your lifestyle and help you achieve sustainable results.",
        experience: 8,
        location: "Mumbai",
        rating: 4.9,
        reviewCount: 127,
        image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
        certifications: ["NASM-CPT", "ACSM-CPT", "Functional Movement Screen"],
        packages: [
          {
            id: "pkg_priya_1",
            name: "Fitness Transformation - 3 Month",
            duration: 3,
            totalSessions: 24,
            price: 30000,
            description: "Complete fitness transformation program with personalized training and nutrition guidance",
            features: [
              "24 personal training sessions",
              "Custom workout plans",
              "Nutrition guidance",
              "Progress tracking",
              "WhatsApp support",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91-9876543211",
        specialization: "nutrition",
        bio: "Licensed nutritionist and dietitian with 10 years of experience in sports nutrition, weight management, and therapeutic diets.",
        experience: 10,
        location: "Delhi",
        rating: 4.8,
        reviewCount: 89,
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
        certifications: ["RD", "CSSD", "PhD Nutritional Sciences"],
        packages: [
          {
            id: "pkg_rajesh_1",
            name: "Nutrition Mastery - 3 Month",
            duration: 3,
            totalSessions: 12,
            price: 20000,
            description: "Complete nutrition overhaul with personalized meal plans and lifestyle coaching",
            features: [
              "12 nutrition consultations",
              "Custom meal plans",
              "Recipe database",
              "Supplement guidance",
              "Email support",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kavya Reddy",
        email: "kavya.reddy@example.com",
        phone: "+91-9876543212",
        specialization: "both",
        bio: "Holistic health coach combining fitness training and nutritional counseling with 6 years of experience.",
        experience: 6,
        location: "Bangalore",
        rating: 4.9,
        reviewCount: 156,
        image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
        certifications: ["ACE-CPT", "Precision Nutrition Level 1", "Yoga Alliance RYT-200"],
        packages: [
          {
            id: "pkg_kavya_1",
            name: "Complete Wellness - 3 Month",
            duration: 3,
            totalSessions: 36,
            price: 45000,
            description: "Integrated fitness and nutrition program for complete lifestyle transformation",
            features: [
              "36 combined sessions",
              "Fitness + nutrition coaching",
              "Meal prep guidance",
              "Lifestyle coaching",
              "Group support",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Arjun Singh",
        email: "arjun.singh@example.com",
        phone: "+91-9876543213",
        specialization: "fitness",
        bio: "Former professional athlete turned fitness coach with 12 years of experience. I specialize in athletic performance, sports conditioning, and injury prevention. My training methods are based on scientific principles and real-world application from my competitive sports background in cricket and athletics.",
        experience: 12,
        location: "Chennai",
        rating: 4.7,
        reviewCount: 203,
        image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
        certifications: ["CSCS", "SAI Level 2", "FMS Level 2"],
        packages: [
          {
            id: "pkg_arjun_1",
            name: "Athletic Performance - 3 Month",
            duration: 3,
            totalSessions: 30,
            price: 35000,
            description:
              "High-performance training program for athletes and fitness enthusiasts",
            features: [
              "30 performance training sessions",
              "Sport-specific conditioning",
              "Injury prevention protocols",
              "Performance testing",
              "Recovery strategies",
            ],
          },
          {
            id: "pkg_arjun_2",
            name: "Elite Athlete Program - 6 Month",
            duration: 6,
            totalSessions: 60,
            price: 65000,
            description:
              "Comprehensive elite-level training program for serious athletes",
            features: [
              "60 elite training sessions",
              "Advanced periodization",
              "Biomechanical analysis",
              "Mental performance coaching",
              "Competition preparation",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Meera Patel",
        email: "meera.patel@example.com",
        phone: "+91-9876543214",
        specialization: "nutrition",
        bio: "Clinical nutritionist with 15 years of experience specializing in therapeutic nutrition, diabetes management, and weight loss. I have helped over 1000 clients achieve their health goals through evidence-based nutrition interventions and sustainable lifestyle modifications. Expert in Indian dietary patterns and Ayurvedic nutrition principles.",
        experience: 15,
        location: "Pune",
        rating: 4.9,
        reviewCount: 312,
        image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg",
        certifications: ["MSc Clinical Nutrition", "CDE", "IAPEN Certified"],
        packages: [
          {
            id: "pkg_meera_1",
            name: "Therapeutic Nutrition - 3 Month",
            duration: 3,
            totalSessions: 15,
            price: 25000,
            description:
              "Medical nutrition therapy for various health conditions with Indian dietary focus",
            features: [
              "15 clinical consultations",
              "Therapeutic meal plans",
              "Medical nutrition therapy",
              "Lab monitoring",
              "Doctor coordination",
            ],
          },
          {
            id: "pkg_meera_2",
            name: "Comprehensive Health - 6 Month",
            duration: 6,
            totalSessions: 30,
            price: 45000,
            description:
              "Complete health transformation through clinical nutrition and Ayurvedic principles",
            features: [
              "30 detailed consultations",
              "Advanced therapeutic protocols",
              "Continuous health monitoring",
              "Supplement protocols",
              "Family nutrition guidance",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rohit Gupta",
        email: "rohit.gupta@example.com",
        phone: "+91-9876543215",
        specialization: "fitness",
        bio: "CrossFit Level 3 trainer and former Indian Army fitness instructor with 9 years of experience in functional fitness and strength training. I help people build real-world strength and conditioning through varied, high-intensity workouts. My military background brings discipline and structure to every training session.",
        experience: 9,
        location: "Kolkata",
        rating: 4.6,
        reviewCount: 78,
        image: "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg",
        certifications: [
          "CrossFit Level 3",
          "Army Physical Training Instructor",
          "Mobility Specialist",
        ],
        packages: [
          {
            id: "pkg_rohit_1",
            name: "Military Fitness - 3 Month",
            duration: 3,
            totalSessions: 36,
            price: 32000,
            description:
              "Military-style functional fitness training with discipline and structure",
            features: [
              "36 functional fitness sessions",
              "Military training techniques",
              "Endurance building",
              "Mental toughness training",
              "Nutrition basics",
            ],
          },
          {
            id: "pkg_rohit_2",
            name: "Elite Conditioning - 6 Month",
            duration: 6,
            totalSessions: 72,
            price: 60000,
            description:
              "Advanced conditioning program based on military training principles",
            features: [
              "72 intensive sessions",
              "Advanced conditioning",
              "Leadership mindset training",
              "Injury prevention",
              "Community support",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sneha Joshi",
        email: "sneha.joshi@example.com",
        phone: "+91-9876543216",
        specialization: "both",
        bio: "Certified wellness coach and yoga instructor with 7 years of experience in holistic health approaches. I combine traditional Indian wellness practices with modern fitness and nutrition science. My programs focus on building healthy habits that align with Indian lifestyle and cultural preferences.",
        experience: 7,
        location: "Hyderabad",
        rating: 4.8,
        reviewCount: 94,
        image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
        certifications: [
          "ACSM-CPT",
          "Yoga Alliance RYT-500",
          "Ayurveda Wellness Counselor",
        ],
        packages: [
          {
            id: "pkg_sneha_1",
            name: "Holistic Wellness - 3 Month",
            duration: 3,
            totalSessions: 18,
            price: 27000,
            description:
              "Traditional Indian wellness program combining yoga, fitness, and Ayurvedic nutrition",
            features: [
              "18 wellness coaching sessions",
              "Yoga and meditation",
              "Ayurvedic nutrition guidance",
              "Stress management techniques",
              "Pranayama sessions",
            ],
          },
          {
            id: "pkg_sneha_2",
            name: "Complete Life Balance - 6 Month",
            duration: 6,
            totalSessions: 36,
            price: 50000,
            description:
              "Comprehensive life balance program integrating ancient wisdom with modern wellness",
            features: [
              "36 comprehensive sessions",
              "Life coaching integration",
              "Habit formation strategies",
              "Work-life balance coaching",
              "Spiritual wellness guidance",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Vikram Malhotra",
        email: "vikram.malhotra@example.com",
        phone: "+91-9876543217",
        specialization: "nutrition",
        bio: "Plant-based nutrition specialist and former chef with 8 years of experience helping clients transition to healthier eating patterns. I specialize in Indian vegetarian and vegan nutrition, making healthy eating delicious and culturally appropriate for Indian families.",
        experience: 8,
        location: "Goa",
        rating: 4.7,
        reviewCount: 65,
        image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
        certifications: [
          "Plant-Based Nutrition Certificate",
          "Culinary Nutrition Expert",
          "VLCC Certified",
        ],
        packages: [
          {
            id: "pkg_vikram_1",
            name: "Plant-Based Transition - 3 Month",
            duration: 3,
            totalSessions: 12,
            price: 18000,
            description:
              "Smooth transition to plant-based nutrition with Indian cuisine focus",
            features: [
              "12 nutrition consultations",
              "Indian plant-based meal plans",
              "Recipe guides and cooking tips",
              "Family meal planning",
              "Shopping guidance",
            ],
          },
          {
            id: "pkg_vikram_2",
            name: "Culinary Wellness - 6 Month",
            duration: 6,
            totalSessions: 24,
            price: 35000,
            description:
              "Complete culinary wellness program combining nutrition with cooking skills",
            features: [
              "24 detailed consultations",
              "Cooking workshops",
              "Advanced meal planning",
              "Restaurant dining guidance",
              "Family nutrition education",
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const users = [
      {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91-9876543220",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Anita Singh",
        email: "anita.singh@example.com",
        phone: "+91-9876543221",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Amit Patel",
        email: "amit.patel@example.com",
        phone: "+91-9876543222",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Clear existing data (optional)
    await db.collection("coaches").deleteMany({})
    await db.collection("users").deleteMany({})

    // Insert data
    const coachResult = await db.collection("coaches").insertMany(coaches)
    const userResult = await db.collection("users").insertMany(users)

    // Create indexes
    await db.collection("coaches").createIndex({ email: 1 }, { unique: true })
    await db.collection("coaches").createIndex({ specialization: 1 })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("subscriptions").createIndex({ userEmail: 1 })
    await db.collection("sessions").createIndex({ userEmail: 1 })

    return NextResponse.json({
      coaches: coachResult.insertedCount,
      users: userResult.insertedCount,
      subscriptions: 0,
      message: "Database seeded successfully with Indian names and cultural context",
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
