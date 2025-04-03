// src/app/api/submit-form/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
    try {
        // Parse the JSON request body
        const body = await request.json();

        // Validate form data
        const { name, email, phone, countryCode } = body;

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Name, email, and phone are required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate phone is numeric
        if (!/^\d+$/.test(phone)) {
            return NextResponse.json(
                { error: 'Phone number should contain only digits' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("luxury_estates");

        // Check if email already exists in the database
        const existingInquiry = await db.collection("inquiries").findOne({ email: email });

        if (existingInquiry) {
            return NextResponse.json({
                success: true,
                isExisting: true,
                message: 'Thank you for your continued interest. Our team is already reviewing your inquiry and will contact you soon with updates on available luxury properties.',
            }, { status: 200 });
        }

        // Create user inquiry object with timestamp
        const formSubmission = {
            name,
            email,
            phone: `${countryCode || '+91'}${phone}`,
            submitted_at: new Date(),
        };

        // Insert into MongoDB
        const result = await db.collection("inquiries").insertOne(formSubmission);

        return NextResponse.json({
            success: true,
            message: 'Thank you for your interest. Your inquiry has been submitted successfully. Our luxury real estate experts will contact you shortly.',
            id: result.insertedId,
        }, { status: 201 });
    } catch (error) {
        console.error('Error submitting form:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}