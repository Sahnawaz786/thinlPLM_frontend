import React from 'react'
import styles from './Auth.module.css'

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
         <div className={styles.topBar1}>
           <h2> <span style={{color:'#8BD556',fontSize:'19px'}}>Think</span><span style={{color:'#C252BC',fontSize:'19px'}}>PLM</span></h2>
         </div>
         <div className={styles.topBar2}>
           <h5>Login Page</h5>
         </div>
      </div>
      <div className={styles.logo}>
        <img className={styles.imglogo} src="images/logo-main.webp" alt="" />
      </div>
      <div className={styles.fotter}>
         <div className={styles.loginForm}>
            <div className={styles.username}>
                <span>User Name</span>
                <input type="text" name="" id="" />
            </div>
            <div className={styles.password}>
                <span>Password</span>
                <input type="text" name="" id="" />
            </div>
            <div className={styles.submitBtn}>
               <button>Login</button>
            </div>
         </div>

        <div className={styles.fotterInfo}>
            {/* <div>

            </div> */}
          <span>If you face any issue please at below details:</span>
          <span>Email:  <span style={{color:'#0070BE',textDecoration:'underline'}}>helpdesk@kkhmechwarecom</span>  </span>
          <span>Call:033-2789564</span>
        </div>

        <div className={styles.fotterLast}>
            <div className={styles.fotterLastInfo}>
            <p>A powerful tool/technology to help manufactures and OEM to manage their Parts,Assembly,Documents,BOM,Supplier and Vendors,Inventory,Purchase </p>
            <p className={styles.sales}>and sales.</p>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Login