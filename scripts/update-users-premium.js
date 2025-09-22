// Script to update all users to isPremium = true
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAllUsersToPremium() {
  try {
    console.log('Starting to update all users to premium status...');
    
    // Update all users to isPremium = true
    const updateResult = await prisma.user.updateMany({
      data: {
        isPremium: true
      }
    });
    
    console.log(`Successfully updated ${updateResult.count} users to premium status.`);
    
    // Optional: List all users with their premium status to verify
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true
      }
    });
    
    console.log('\nVerification - Users with premium status:');
    users.forEach(user => {
      console.log(`${user.name || 'No name'} (${user.email}): Premium = ${user.isPremium}`);
    });
    
    return updateResult.count;
  } catch (error) {
    console.error('Error updating users to premium status:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
updateAllUsersToPremium()
  .then(count => {
    console.log(`\nOperation completed. ${count} users were updated to premium status.`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Operation failed:', error);
    process.exit(1);
  });
