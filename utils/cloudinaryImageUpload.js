// import cloudinary from './cloudinary.js';
import {cloudinary} from '../index.js';
import fs from 'fs';


export const getCloudinaryLink = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next();
    }
  
    try {
      const folderName = 'Bookings'; 
  
     
    const fileUploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          file.path, 
          {
            folder: folderName,
          },
          (error, result) => {
            if (error) {
              return reject(new Error('Cloudinary upload failed: ' + error.message));
            }

            // Delete the file from the server
            fs.unlink(file.path, err => {
              if (err) {
                console.error('Failed to delete local file:', err);
              } else {
                console.log('Deleted local file:', file.path);
              }
            });

            // resolve(result.secure_url);
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        );
      });
    });
  
      // const fileUrls = await Promise.all(fileUploadPromises);
      const fileResults = await Promise.all(fileUploadPromises);
      // Attach the URLs to req.body for the next middleware
      // req.body.files = fileUrls;
      req.body.files = fileResults.map(file => file.url);
      req.body.publicIds = fileResults.map(file => file.publicId);
      
      next(); // Pass control to the next middleware
    } catch (error) {
      next(error);
    }
  };



export const deleteCloudinaryImage = async (publicId) => {
  try {

    const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId);

    if (cloudinaryResponse.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }

    
  } catch (error) {
    console.error('Error during image deletion:', error);
    throw new Error('Image deletion failed: ' + error.message);
  }
};