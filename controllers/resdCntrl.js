import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";
import nodemailer from 'nodemailer'

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
    
  } = req.body.data;

  console.log(req.body.data)

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already there");
    }
    throw new Error(err.message);
  }
});

// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {

  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies);
});


// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});

export const sendEmail = asyncHandler(async (req, res) => {
  const { data  , userEmail} = req.body;

   
  const emailBody = `
  <h2>${data.title}</h2>
  <img src="${data.image}" alt="House Image" style="max-width: 100%; height: auto;">
  <p><strong>Price:</strong> $ ${data.price}</p>
  <p><strong>Description:</strong> ${data.description}</p>
  <p><strong>Facilities:</strong>   ${data?.facilities?.bathrooms} Bathrooms , <span>${data?.facilities.parking} Parking , ${data?.facilities.bedrooms} Room/s</p>
  <p><strong>Address:</strong> ${data.address}, ${data.city}, ${data.country}</p>
`;


  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vikashvermacom92@gmail.com',
      pass: 'obal jvgo womf sabd' 
    }
  });

  // Email message options
  let mailOptions = {
    from: 'vk23developer@gmail.com', // Sender address
    to: userEmail, // List of recipients
    subject: 'Property Details', // Subject line
    html: emailBody // Email body
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(400).send('Failed to send email');
  }
});
