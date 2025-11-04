import React from 'react'
import { useAuth } from '../context/AuthContext'
const Dashboard = () => {
const {user}=useAuth();

  console.log(user);
  return (
    <div>
     hi !!
    </div>
  )
}

export default Dashboard
