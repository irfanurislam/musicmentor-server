// import React from 'react';
// todo--parsefloat=====
// import React from 'react';
// import { useLoaderData } from 'react-router-dom';
// import PaymentFrom from './PaymentFrom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(import.meta.env.VITE_Payment_PK);

// const Payment = () => {
//   const data = useLoaderData();
//   const total = parseFloat(data.price).toFixed(2);
//   const price = parseFloat(total);

//   return (
//     <div>
//       <h2 className='text-center pb-5'>Money !!!</h2>
//       <Elements stripe={stripePromise}>
//         <PaymentFrom newPay={data} price={price}></PaymentFrom>
//       </Elements>
//     </div>
//   );
// };

// export default Payment;

// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../../../Components/Provider/AuthProvider";
// import useChart from "../../../../../Hooks/useChart";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

// const PaymentFrom = ({ price, newPay }) => {
//   const navigate = useNavigate();
//   const { Chart, refetch } = useChart();
//   const [clientSecret, setClientSecret] = useState("");
//   const [cardError, setCardError] = useState("");
//   const { User } = useContext(AuthContext);
//   const stripe = useStripe();
//   const [process, setprocess] = useState(false);
//   const elements = useElements();
//   const [tranjectionID, settrandjection] = useState("");

//   useEffect(() => {
//     // Create PaymentIntent as soon as the page loads
//     fetch("https://ass-12-server-mu.vercel.app/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ price }),
//     })
//       .then((res) => res.json())
//       .then((data) => setClientSecret(data.clientSecret));
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     const card = elements.getElement(CardElement);

//     if (card == null) {
//       return;
//     }

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card,
//     });

//     if (error) {
//       console.log("[error]", error);
//       setCardError(error.message);
//     } else {
//       // console.log('[PaymentMethod]', paymentMethod);
//     }

//     setprocess(true);
//     const { paymentIntent, error: confirmError } =
//       await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: card,
//           billing_details: {
//             name: User?.displaName || "unknown",
//             email: User?.email || "No-Email",
//           },
//         },
//       });
//     if (confirmError) {
//       setCardError(confirmError.message);
//     }
//     setprocess(false);
//     if (paymentIntent.status === "succeeded") {
//       settrandjection(paymentIntent.id);
//       const tranjectId = paymentIntent.id;

//       // Todo ==>> Agamikal eikhan theke kaj start korbo =====>>>>>>>Backend a data save delet and update student and enroll classes==========>>>>
//       const {
//         _id,

//         Availableseats,

//         className,

//         instructorEmail,

//         insName,

//         price,

//         students,
//         oldId,
//         classImage,

//         userName,

//         userEmail,
//       } = newPay;

//       const date = new Date();

//       const newdata = {
//         bookamekID: _id,
//         Availableseats: Availableseats - 1,
//         className,
//         instructorEmail,
//         insName,
//         price,
//         students: students + 1,
//         classImage,
//         userName,
//         userEmail,
//         tranjectId,
//         oldId,
//         date,
//       };

//       fetch("https://ass-12-server-mu.vercel.app/paymentcomplete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newdata),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           Swal.fire({
//             position: "top-center",
//             icon: "success",
//             title: "Payment Succefully",
//             showConfirmButton: false,
//             timer: 1500,
//           });
//           navigate("/dashboard/bookmarkedclasses");
//           refetch();
//         });
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement
//         options={{
//           style: {
//             base: {
//               fontSize: "16px",
//               color: "#424770",
//               "::placeholder": {
//                 color: "#aab7c4",
//               },
//             },
//             invalid: {
//               color: "#9e2146",
//             },
//           },
//         }}
//       />
//       <button
//         type="submit "
//         className="btn btn-primary btn-sm "
//         disabled={!stripe || !clientSecret || process}
//       >
//         Pay
//       </button>
//       {cardError && <p className="text-red-800 p-4  mr-5">{cardError}</p>}
//       {tranjectionID && (
//         <p className="text-green-600 p-4  mr-5">
//           Trsnsection Compleate - {tranjectionID}
//         </p>
//       )}
//     </form>
//   );
// };

// export default PaymentFrom;





// // app.post('/payments', verifyJWT, async (req, res) => {
//   const payment = req.body;
//   const insertResult = await paymentCollection.insertOne(payment);
//   const cartId = payment.cartId;
//   const cartQuery = { _id: new ObjectId(cartId) };
//   const cart = await cartCollection.findOne(cartQuery);
//   const deleteResult = await cartCollection.deleteOne(cartQuery);
//   if (cart.seats === 0) {
//     // No available seats, return an error response
//     return res.status(400).json({ error: 'No available seats' });
//   }

//   const seatsToUpdate = cart.seats; // Convert string to number
//   if (isNaN(seatsToUpdate)) {
//     // Invalid seat value, return an error response
//     return res.status(400).json({ error: 'Invalid seat value' });
//   }
//   const classQuery = { _id: new ObjectId(payment.classId) };
//   const classUpdate = { $inc: { seats: -seatsToUpdate } };

//   const updateResult = await classesCollection.updateMany(classQuery, classUpdate);

//   if (updateResult.modifiedCount === 0) {
//     // Failed to update seats, return an error response
//     return res.status(400).json({ error: 'Failed to update seats' });
//   }

 

//   res.json({ insertResult, deleteResult });
// });




















const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/users'); // Replace '/api/user' with your API endpoint URL
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }
console.log('shihab',userData)
console.log('shihab',userData?.role)



{userData.role === 'admin' && (
    <>
      <li>
        <NavLink to="/dashboard/adminhome">
          <FaHome></FaHome> Admin Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/manageuser">
          <FaUserCog></FaUserCog> Manage User
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/manageclass">
          <FaCog></FaCog> Manage Class
        </NavLink>
      </li>
    </>
  )}

  {userData.role === 'instructor' && (
    <>
      <li>
        <NavLink to="/dashboard/selectedclasses">
          <FaUsers></FaUsers> All Users
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/addclass">
          <FaPlusCircle></FaPlusCircle> Add Class
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/myclass">
          <FaPlusCircle></FaPlusCircle> My Class
        </NavLink>
      </li>
    </>
  )}

  {userData.role !== 'admin' && userData.role !== 'instructor' && (
    <>
      <li>
        <NavLink to="/dashboard/payment">
          <FaCreditCard></FaCreditCard> Payment
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/myenrolled">
          <FaCreditCard></FaCreditCard> myenrolled
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/paymenthistory">
          <FaCreditCard></FaCreditCard> history
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/mycart">
          <FaShoppingCart></FaShoppingCart> My Cart
        </NavLink>
      </li>
    </>
  )}
      