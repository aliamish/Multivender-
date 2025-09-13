import React from 'react'
import styles from '../../styles/style'
import ShopInfo from '../../components/shop/ShopInfo' 
import ShopProfileData from '../../components/shop/ShopProfileData'
const ShopHomePage = () => {
  return (
   <div className={`${styles.section}`}>  
  <div className="w-full 800px:flex pt-10 justify-between items-start">
    {/* Sticky column */}
    <div className="800px:w-[30%] bg-white rounded-md 800px:overflow-y-scroll 800px:h-[95vh] shadow-sm 800px:sticky top-10">
      <ShopInfo isOwner={false}/>
    </div> 

    {/* Scrollable content */}
    <div className="800px:w-[72%] mt-5 800px:mt-['unset']  rounded--[4px]">
      <ShopProfileData isOwner={false}/>
    </div>
  </div>
</div>
  )
}

export default ShopHomePage
