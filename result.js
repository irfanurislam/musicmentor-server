
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProviders';



const useAxiosSecure = () => {
  const { logOut } = useContext(AuthContext)
  const navigate = useNavigate(); 

  const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000', 
  });

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate, axiosSecure]);

  return [axiosSecure];
};

export default useAxiosSecure;












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
      


  // dashbpard

  Tanvir Evan
  import { useState, useEffect, useContext } from 'react';
  import { Link, Outlet } from 'react-router-dom';
  import {
    AiFillStar,
    AiFillCheckCircle,
    AiOutlineUser,
    AiOutlinePlus,
  } from 'react-icons/ai';
  import { BsFillGridFill, BsFillPeopleFill } from 'react-icons/bs';
  import useUsers from '../../Hooks/useUsers';
  import { AuthContext } from '../Components/Provider/AuthProvider';
  
  
  
  const Dashboard = () => {
  
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { User } = useContext(AuthContext)
    const { users } = useUsers();
  
    const activeUserEmail = User?.email
    const findUser = users?.find(user => user?.email === activeUserEmail)
    useEffect(() => {
      const handleResize = () => {
        setIsSidebarOpen(window.innerWidth >= 768);
      };
  
      window.addEventListener('resize', handleResize);
      handleResize();
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    let dashboardTitle = '';
    if (findUser?.role === 'admin') {
      dashboardTitle = 'Admin Dashboard';
    } else if (findUser?.role === 'instructor') {
   
      dashboardTitle = 'Instructor Dashboard';
    } else {
      dashboardTitle = 'User Dashboard';
    }
  
    return (
      <div className="flex min-h-screen">
      
        {isSidebarOpen && (
          <aside className="bg-gradient-to-b from-purple-400 to-pink-400 text-white w-64 p-4">
            <div className="text-3xl font-bold mb-8 ">{dashboardTitle}</div>
            <ul className="space-y-4">
           <li>
           <Link
                      to="/dashboard"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                     <BsFillGridFill className="mr-2" />
                      <span>Dashboard Home</span>
                    </Link>
           </li>
              {!findUser?.role && (
                <>
                  <li>
                    <Link
                      to="/dashboard/bookmarkedclasses"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                      <AiFillStar className="mr-2" />
                      <span>Bookmarked Classes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/enrolledclasses"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                      <AiFillCheckCircle className="mr-2" />
                      <span>Enrolled Classes</span>
                    </Link>
                  </li>
                </>
              )}
  
              {findUser?.role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/dashboard/manageclasses"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                      <AiFillCheckCircle className="mr-2" />
                      <span>Manage Classes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/menageuser"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                      <BsFillPeopleFill className="mr-2" />
                      <span>Manage Users</span>
                    </Link>
                  </li>
                </>
              )}
  
           
              {findUser?.role === "instructor" && (
                <>
                  <li>
                    <Link
                      to="/dashboard/addaclass"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                      <AiOutlinePlus className="mr-2" />
                      <span>Add a Class</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/ALlclassesIns"
                      className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                    >
                      <AiOutlineUser className="mr-2" />
                      <span>My Classes</span>
                    </Link>
                  </li>
                </>
              )}
  
           
              <div className="border-b border-purple-600 my-4" />
              <li>
                <Link
                  to="/"
                  className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                >
                  <BsFillGridFill className="mr-2" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/classes"
                  className="hover:text-purple-200 transition-colors duration-300 flex items-center"
                >
                  <AiFillCheckCircle className="mr-2" />
                  <span>Our Classes</span>
                </Link>
              </li>
            </ul>
          </aside>
        )}
  
  
        <main className="flex-1 bg-gray-100 p-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl text-center  mb-8 font-bold">Welcome, {findUser?.name}!</h1>
          </div>
          <div className="overflow-auto">
            <Outlet />
          </div>
        </main>
  
  
        <div
          className={`fixed top-4 right-4 md:hidden bg-purple-400 p-2 rounded-full text-white cursor-pointer transition-colors duration-300 ${isSidebarOpen ? 'hover:bg-purple-500' : 'hover:bg-purple-300'
            }`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </div>
      </div>
    );
  };
  
  export default Dashboard;

















// /////////////////////////////////








  {isAdmin && (
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
  
  {isInstructor && (
    <>
     
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
  
  {!isAdmin &&  !isInstructor && (
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
  
