import React from 'react'

function footer() {
  return (
    <div>
       <div className='mt-8 w-full bg-black px-8 md:px-[300px] flex md:flex-row flex-col space-y-6 md:space-y-0 items-start justify-between sm:justify-center md:justify-between text-sm md:text-md py-10'>
        <div className='flex flex-col text-white'>
         <p>Featured Blogs</p>
         <p>Most Viewed</p>
         <p>Readers choice</p>
        </div>
        <div className='flex flex-col text-white'>
         <p>Forcum</p>
         <p>Support</p>
         <p>Recent Posts</p>
        </div>
        <div className='flex flex-col text-white'>
            <p>Privacy policy</p>
         <p>About us</p>
        
         <p>Terms & condition</p>
        </div>
       </div>
       <p className='py-2 pb-6 text-center text-white bg-black text-sm'>All rights reserved @Jasmeet</p>
    </div>
  )
}

export default footer
