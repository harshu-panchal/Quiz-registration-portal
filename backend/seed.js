require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Quiz = require('./src/models/Quiz');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Student.deleteMany({});
        await Quiz.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@quiz.com',
            password: 'admin123',
            role: 'admin',
            avatar: 'https://i.pravatar.cc/150?u=admin',
        });
        console.log('✅ Admin user created:', admin.email);

        // Create sample students
        const students = await Student.create([
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                school: 'Evergreen High School',
                class: '10th Grade',
                city: 'San Francisco',
                state: 'California',
                age: 16,
                status: 'Active',
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+1 (555) 234-5678',
                school: 'Oakwood Academy',
                class: '11th Grade',
                city: 'New York',
                state: 'New York',
                age: 17,
                status: 'Active',
            },
            {
                name: 'Robert Fox',
                email: 'robert.fox@example.com',
                phone: '+1 (555) 345-6789',
                school: 'Riverside International',
                class: '12th Grade',
                city: 'Austin',
                state: 'Texas',
                age: 18,
                status: 'Inactive',
            },
        ]);
        console.log(`✅ Created ${students.length} sample students`);

        // Create sample quizzes
        const quizzes = await Quiz.create([
            {
                title: 'Entrance Assessment 2024',
                description: 'Mandatory screening quiz for new computer science enrollments.',
                category: 'Screening',
                questions: 25,
                timeLimit: '45 mins',
                status: 'Active',
                type: 'Google Form',
                link: 'https://forms.google.com/quiz-1',
                createdBy: admin._id,
            },
            {
                title: 'Mid-Term Python Basics',
                description: 'Assessment covering basic syntax, loops, and data structures.',
                category: 'Academic',
                questions: 40,
                timeLimit: '60 mins',
                status: 'Draft',
                type: 'Internal',
                createdBy: admin._id,
            },
        ]);
        console.log(`✅ Created ${quizzes.length} sample quizzes`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('   Email: admin@quiz.com');
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
