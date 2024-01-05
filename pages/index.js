import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { useState,useEffect } from 'react'
import { ethers } from 'ethers'
import * as Constants from "../Utils/config"
export default function Home() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
        }
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          console.log(await signer.getAddress())
          const contract = new ethers.Contract(Constants.contractAddress, Constants.contractABI, signer)
          let tas = await contract.getAllTasks()
          setTasks(tas)
          console.log(tas)
        }else{
          console.log("Please install Metamask")
        }
      
      } catch (error) {
        console.log(error)
      }
    }
    connectToMetamask()
  }, [])
  const handleChange = (e) => {
    setTask(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(await signer.getAddress())
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractABI, signer)
        const addTask = await contract.addTask(task)
        await addTask.wait()
        let tas = await contract.getAllTasks()
        setTasks(tas)
        console.log(tas)
      }else{
        console.log("Please install Metamask")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleChangeStatus = async (index) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(await signer.getAddress())
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractABI, signer)
        const addTask = await contract.markAsFinished(index)
        await addTask.wait()
        let tas = await contract.getAllTasks()
        setTasks(tas)
        console.log(tas)
      }else{
        console.log("Please install Metamask")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
<div>
<div className={styles.container}>
  Welcome to the Dapp
</div>
<div className={styles.container}>
<form className={styles.form} onSubmit={handleSubmit}>
<input  type='text' name='task' placeholder='Add task here...' onChange={handleChange} value={task}/>
<button type='submit'>Add Task</button>
</form>
</div>
<div className={styles.container}>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Task ID</th>
        <th>Task Desc</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
     {tasks.map((task,index) => {
        return(
          <tr key={index}>
            <td>{index}</td>
            <td>{task.desc}</td>
            <td>{task.status === 0 ? "Pending" : "Completed"}</td>
            <td>{task.status === 0 ? <button onClick={()=>{handleChangeStatus(index)}}>Mark as Done</button> : ""}</td>
          </tr>
        )
        })
     }
    </tbody>
    </table>
</div>
</div>
  )
}
