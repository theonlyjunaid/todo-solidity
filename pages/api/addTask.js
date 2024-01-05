// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers"
import * as Constants from '../../Utils/config'

export default async function handler(req, res) {
    const desc  = req.body
   
        try {
            const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL)
            const wallet = new ethers.Wallet(Constants.PRIVATE_KEY, provider)
            const contract = new ethers.Contract(Constants.contractAddress, Constants.contractABI, wallet)
            const addTask = await contract.addTask(desc)
            await addTask.wait()

            res.status(200).json({ message: "Task Added" })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: "Error", error })
        }
  }
  