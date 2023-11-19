import { useState } from "react"

const initialFriends = [
   {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
   },
   {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
   },
   {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
   },
]

export default function App() {
   const [friends, setFriends] = useState([...initialFriends])
   const [showAddFriend, setShowAddFriend] = useState(false)
   const [selectedFriend, setSelectedFriend] = useState(null)

   function handleShowAddFriend() {
      setShowAddFriend((show) => !show)
   }

   function handleAddFriend(friend) {
      setFriends((f) => [...f, friend])
      setShowAddFriend(false)
   }

   function handleSelectedFriend(f) {
      setSelectedFriend((selected) => (selected?.id === f.id ? null : f))
   }

   function handleSplitBill(value) {
      setFriends((friends) =>
         friends.map((f) =>
            f.id === selectedFriend.id
               ? { ...f, balance: f.balance + value }
               : f
         )
      )
      setSelectedFriend(null)
   }
   return (
      <div className="app">
         <div className="sidebar">
            <FriendsList
               friends={friends}
               onSelect={handleSelectedFriend}
               selectedFriend={selectedFriend}
            />
            {showAddFriend && <AddFriendList onAddFriend={handleAddFriend} />}
            <Button onClick={handleShowAddFriend}>
               {showAddFriend ? "Close" : "Add Friend"}
            </Button>
         </div>
         {selectedFriend && (
            <FormSplitBill
               selectedFriend={selectedFriend}
               onSplitBill={handleSplitBill}
            />
         )}
      </div>
   )
}

function FriendsList({ friends, onSelect, selectedFriend }) {
   return (
      <ul>
         {friends.map((f) => (
            <Friend
               friend={f}
               key={f.id}
               onSelect={onSelect}
               selectedFriend={selectedFriend}
            />
         ))}
      </ul>
   )
}

function Friend({ friend, onSelect, selectedFriend }) {
   const isSelected = friend.id === selectedFriend?.id
   return (
      <li className={isSelected ? "selected" : ""}>
         <img src={friend.image} alt="profile" />
         <h3>{friend.name}</h3>
         {friend.balance > 0 && (
            <p className="green">
               {friend.name} owes you {Math.abs(friend.balance)}$
            </p>
         )}
         {friend.balance < 0 && (
            <p className="red">
               you owes {friend.name} {Math.abs(friend.balance)}$
            </p>
         )}
         {friend.balance === 0 && (
            <p className="gray">{friend.name} and You are even</p>
         )}
         <Button onClick={() => onSelect(friend)}>
            {isSelected ? "Close" : "Select"}
         </Button>
      </li>
   )
}

function Button({ children, onClick }) {
   return (
      <button className="button" onClick={onClick}>
         {children}
      </button>
   )
}

function AddFriendList({ onAddFriend }) {
   const [name, setName] = useState("")
   const [image, setImage] = useState("https://i.pravatar.cc/48")

   function handleSubmit(e) {
      e.preventDefault()

      if (!name || !image) return

      const id = crypto.randomUUID()

      const newFriend = {
         id,
         name,
         image: `${image}?u=${id}`,
         balance: 0,
      }

      onAddFriend(newFriend)

      setName("")
      setImage("https://i.pravatar.cc/48")
   }

   return (
      <form className="form-add-friend" onSubmit={handleSubmit}>
         <label>🧑🏼‍🤝‍🧑🏼 Name</label>
         <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
         />

         <label>🖼️Image URL</label>
         <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
         />

         <Button>Add</Button>
      </form>
   )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
   const [bill, setBill] = useState("")
   const [paidByUser, setPaidByUser] = useState("")
   const [whoIsPaying, setWhoIsPaying] = useState("user")
   const paidByFriend = bill ? bill - paidByUser : ""

   function handleSubmit(e) {
      e.preventDefault()
      if (!bill || !paidByUser) return

      onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)
   }

   return (
      <form className="form-split-bill" onSubmit={handleSubmit}>
         <h2>split a bill with {selectedFriend.name}</h2>
         <label>💰Bill Value</label>
         <input
            type="text"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
         />
         <label>🧍🏻‍♂️Your Expense</label>
         <input
            type="text"
            value={paidByUser}
            onChange={(e) =>
               Number(e.target.value) <= bill
                  ? setPaidByUser(Number(e.target.value))
                  : paidByUser
            }
         />
         <label>🧍🏻‍♀️{selectedFriend.name}'s Expense</label>
         <input type="text" disabled value={paidByFriend} />
         <label>Who Is Paying The Bill</label>
         <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}>
            <option value="user">You</option>
            <option value="friend">{selectedFriend.name}</option>
         </select>

         <Button>Split Bill</Button>
      </form>
   )
}
