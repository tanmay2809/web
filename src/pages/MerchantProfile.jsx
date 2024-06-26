import React, { useEffect, useState } from "react";
import { useSnackBae } from "../context/SnackBae";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";

//components
import MerchantNavbar from "../component/MerchantNavbar";
import { useParams } from "react-router-dom";
import ToggleSwitch from "../component/ToggleSwitch";
import MenuCard from "../component/MenuCard";
import MerchantOffers from "../component/MerchantOffers";
import Menucomment from "../component/Menucomment";
import MerchantEvents from "../component/MerchantEvents";
import MerchantShare from "../component/MerchantShare";
import SuccessPayment from "../component/SuccessPayment";
import FailurePayment from "../component/FailurePayment";
import FlashScreen from "../component/FlashScreen";

//icons
import { MdOutlineShare } from "react-icons/md";
import { FaAnglesRight } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { TbPinnedFilled } from "react-icons/tb";

//image
import Instagram from "../assets/Instagram.png";
import groupImage from "../assets/groupImage.png";
import eventnofound from "../assets/eventnofound.png";
import Restaurantmenu from "../assets/Restaurantmenu.png";
import termsImage from "../assets/termsImage.png";
import foodos from '../assets/foodos.png';
import offersImg from '../assets/offers.png';
import noReccomandation from '../assets/noReccomandation.png';
import nofavorite from '../assets/nofavorite.png';
import defaultuser from '../assets/review.jpg';
import notliked from '../assets/notliked.png'
import good from '../assets/good.png'
import musttry from '../assets/musttry.png';
import fssai from '../assets/fssai.png';
import logo from '../assets/logo.png';
import Youtube from '../assets/Youtube.png';
import Facebook from '../assets/Facebook.png';
import recommand from "../assets/recommand.jpg"
import noproductfound from '../assets/noproductfound.gif';

// otp
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";





//restaurentdata
const restaurantOffers = [

];



const MerchantProfile = () => {

  const {
    login,
    setLogin,
    isOn,
    setIsOn,
    setShareVisible,
    shareVisible,
    restaurentdata,
    setRestaurentData,
    User,
    openprofile,
    setOpenProfile,
    setLoader,
    editprofile,
    setEditProfile,
    paymentamount,
    setPaymentAmount,
    successPayment,
    setsuccesspayment,
    failurePayment,
    setfailurepayment,
    commentVisible,
    setCommentVisible,
    setMenuId,
    favoriteMenu, recommend, setRecommend,
  } = useSnackBae();

  const calculateTimeDifference = (fateDate) => {
    // Convert fate date to Date object
    const fateDateTime = new Date(fateDate);
    // console.log(fateDateTime);
    // Current date
    const currentDate = new Date();

    // Calculate time difference in milliseconds
    const timeDifference = currentDate.getTime() - fateDateTime.getTime();
    // console.log(timeDifference);
    // Convert milliseconds to days, weeks, or months
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(daysDifference / 30);

    // Determine appropriate label based on time difference
    if (monthsDifference >= 1) {
      return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else if (weeksDifference >= 1) {
      return `${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ago`;
    } else {
      if (daysDifference == 0)
        return "Today"
      else
        return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }
  };


  const { id } = useParams();
  const navigate = useNavigate();
  const [filterone, setFilterone] = useState('new');
  const [flashLoader, setFlashLoader] = useState(false);
  const [menus, setMenus] = useState(true);
  const [Recomendations, setRecomendations] = useState(false);
  const [Favourite, setFavourite] = useState(false);
  // const [events, setEvents] = useState(false);
  const [offers, setoffers] = useState(false);
  const [filter, setFilter] = useState(false);
  //login and signup
  const [openphno, setOpenPhno] = useState(true);
  const [openotp, setOpenOtp] = useState(false);
  const [user, setUser] = useState();
  // phoneNumber
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  //otp
  const [otp, setOtp] = useState("");
  //profile
  const [profileData, setProfileData] = useState({
    // profileImage: userimg,
    name: "",
    gender: "",
    dob: "male",
    contact: "",
    email: "",
    foodPreference: "",
    anniversary: "",
    terms: false,
  });
  //payment
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [ishidden, setIsHidden] = useState(false);
  //search bar
  const [search, setSearch] = useState("");
  const [searchMenuItems, setSearchMenuItems] = useState(null);
  //get all menu items for recommendation
  const [mostRecomended, setMostRecomended] = useState();
  // toggle data for more than 4
  const [showAllCategories, setShowAllCategories] = useState({});
  const [showAllMostRecommended, setShowAllMostRecommended] = useState(true);
  //editprofile
  const [editprofileData, setEditProfileData] = useState({
    // profileImage: userimg,
    name: "",
    gender: "",
    dob: "",
    contact: '',
    email: "",
    foodPreference: "",
    anniversary: "",
  });

  //payment for bill
  const [amountToPay, setamountToPay] = useState('');
  const [pinCommentIds, setPinCommentIds] = useState([]);
  //links for url 
  const youtubeLink = restaurentdata?.youtubeLink;
  const facebookLink = restaurentdata?.facebookLink;
  const instaLink = restaurentdata?.instaLink;

  useEffect(() => {
    forRecommendation();
    helper();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setLogin(true);
      setOpenPhno(true);
    }

    updateVisitorsRecord();
  }, []);

  function helper() {
    setFlashLoader(true); // add flashloader true

    const flashLoaderTimeout = setTimeout(() => {
      setFlashLoader(false);
    }, 4000);

    // Clean up the timeout on component unmount
    return () => clearTimeout(flashLoaderTimeout);
  }

  const updateVisitorsRecord = async (req, res) => {

    let isValueStored = JSON.parse(localStorage.getItem("snackBae_code"));
    if (isValueStored) {
      const now = new Date().getTime();
      const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      // we check if the item has expired
      if (now - isValueStored.timestamp > twelveHours) {
        localStorage.removeItem("snackBae_code");
        isValueStored = null;
      }
    }
    if (!isValueStored) {
      //updating the count
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/updateVisitorsCount/${id}`,
        headers: {}
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      //set the item
      const item = {
        value: "for visitors count",
        timestamp: new Date().getTime() // current time in milliseconds
      };
      localStorage.setItem("snackBae_code", JSON.stringify(item));
    }


    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const userId = user._id;
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/updateVisitorsData/${userId}/${id}`,
        headers: {}
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    if (login || commentVisible || shareVisible || editprofile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [login, commentVisible, shareVisible, editprofile]);

  useEffect(() => {
    setEditProfileData(User);
  }, [editprofile]);

  console.log("restaurentdata", restaurentdata);

  const handleRecommand = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    console.log(userId);
    if (userId) {
      let data = "";

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/toggleRecommendation/${userId}/${id}`,
        // url : `http://localhost:4000/api/toggleRecommendation/${userId}/${id}`,
        headers: {},
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setRecommend(!recommend);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLogin(true);
      setOtp(true);
    }
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    const headerOffset = 180; // Adjust this value to match the height of your fixed header

    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      console.warn(`Element with ID "${id}" not found.`);
    }
  };

  const handlePhoneChange = (e) => {
    const inputPhoneNumber = e.target.value.replace(/\D/g, "");
    if (inputPhoneNumber.length <= 10) {
      setPhoneNumber(inputPhoneNumber);
    }
  };

  const handleSubmit = async () => {
    console.log("inside onsignup");
    setLoading(true);
    try {
      // Initialize invisible reCAPTCHA verifier

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth, "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              onSignup();
            },
            "expired-callback": () => { },
          },

        );
      }

      const appVerifier = window.recaptchaVerifier;

      // Verify the phone number format
      const formatPh = "+91" + phoneNumber;
      console.log(formatPh);

      // Ask user to solve reCAPTCHA before continuing
      // const appVerifier = window.recaptchaVerifier;

      // Sign in with phone number
      const confirmation = await signInWithPhoneNumber(
        auth,
        formatPh,
        appVerifier
      );
      console.log(confirmation);
      setUser(confirmation);
      setOpenPhno(false);
      setOpenOtp(true);
      toast.success("Successfully sent verification code!");
    } catch (err) {
      console.log(err);
      toast.error(err.message || "An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpChange = (e) => {
    const otpNumber = e.target.value.replace(/\D/g, "");
    if (otpNumber.length <= 6) {
      setOtp(otpNumber);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);  // loading for popup
    try {
      await user.confirm(otp);
      //   toast({
      //     title: "OTP verified",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //     position: "top-right",
      //   });
      //   setMobile(false);
      //   setShowOTP(false);

      // setOpenPhno(false);
      // setOpenOtp(false);

      // finding if user exists
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/checkContactExists/${phoneNumber}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response.data.data != null && response.data.data.length != 0) {
            // if user exists
            console.log("inside if user exists");

            localStorage.setItem("user", JSON.stringify(response.data.data));
            setOpenPhno(false);
            setOpenOtp(false);
            setOpenProfile(false);
            setLogin(false);
            toast.success('loggedIn successfully!');
            // navigate(`/profile/merchant/${id}`);

            setUser(JSON.parse(localStorage.getItem("user")));
            const temp = JSON.parse(localStorage.getItem("temp"));
            if (temp) {
              setCommentVisible(temp?.commentVisible);
              setMenuId(temp?.menuId);
            }
            localStorage.removeItem("temp");
            window.location.reload();
          } else {
            setOpenPhno(false);
            setOpenOtp(false);
            setOpenProfile(true);
            toast.success('otp successfully');
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(err);
        });
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleChangeProfile = (e) => {
    const { name, value, type, checked, files } = e.target;

    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    profileData.contact = phoneNumber;
    console.log("Profile data :", profileData);
    const data = JSON.stringify(profileData);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://goldfish-app-yhaxv.ondigitalocean.app/api/addUser",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("profile section ", JSON.stringify(response));
        console.log(JSON.stringify(response.data.data));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setLogin(false);
        setOpenProfile(false);
        toast.success('SignUp Successfully!');
        // navigate(`/profile/merchant/${id}`);
        setUser(JSON.parse(localStorage.getItem("user")));
        const temp = JSON.parse(localStorage.getItem("temp"));
        if (temp) {
          setCommentVisible(temp?.commentVisible);
          setMenuId(temp?.menuId);
        }
       window.location.reload();
        localStorage.removeItem("temp");
      })
      .catch((error) => {
        console.log(error);
      });
    // window.location.reload();
    setLoading(false);
  };
  console.log('user ', User.name);
  const handleSearch = (e) => {
    const inputValue = e.target.value;
    setSearch(inputValue || ""); // Ensure search is never set to null

    if (!inputValue) {
      // If input value is empty or length is less than or equal to 1, clear search menu items
      setSearchMenuItems(null);
      return;
    }

    searchMenu();
  };

  const searchMenu = async (req, res) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/searchMenu/${id}/${search}`,
      headers: {},
    };

    axios.request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        console.log("Search item", (response.data.menuItems));
        setSearchMenuItems(response.data.menuItems);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const forRecommendation = async (req, res) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/getTop5/${id}`,
      headers: {},
    };

    axios.request(config)
      .then((response) => {
        console.log("top5 items", (response.data));
        setMostRecomended(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const toggleCategory = (categoryId) => {
    setShowAllCategories(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));

  };

  const toggleMostRecommended = () => {
    setShowAllMostRecommended(prevState => !prevState);
  };



  const handleEditProfile = (e) => {
    const { name, value, type, checked, files } = e.target;

    setEditProfileData((prevProfileData) => ({
      ...prevProfileData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmitEditProfile = () => {
    console.log("editprofileData: ", editprofileData)
    setLoading(true);
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `https://goldfish-app-yhaxv.ondigitalocean.app/api/user/${User._id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: editprofileData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success('successfully updated!');
        setEditProfile(!editprofile);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
    setLoading(false);
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      console.log("hello");
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  const userId = User?._id;
  const handlePayment = async (event) => {
    // console.log(amount);
    event.preventDefault();
    try {
      setTimeout(() => {
        setPaymentAmount('');
        setPaymentVisible(false);
      }, 3000);
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      const orderResponse = await axios.post(
        "https://goldfish-app-yhaxv.ondigitalocean.app/api/payment/capturepayment",
        { amount: paymentamount }
      );
      console.log(orderResponse);
      // setAmount("");
      // Opening the Razorpay SDK
      const options = {
        key: "rzp_live_gmPEn9SzKAciFs",
        currency: orderResponse.data.data.currency,
        amount: `${orderResponse.data.data.amount}`,
        order_id: orderResponse.data.data.id,
        name: "SnackBae",
        description: "Thank you for the payment",
        image: logo,
        handler: function (response) {
          console.log(response);
          verifypayment({ ...response, id, userId, amount: paymentamount });
        },
        "prefill": {
          "name": User.name,
          "email": User.email,
          "contact": User.contact
        },
        "theme": {
          "color": "#3399cc"
        }
      };
      console.log("hello");
      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
      paymentObject.on("payment.failed", function (response) {
        // toast.error("Oops! Payment Failed.");
        console.log(response.error);
      });
      //setAmount("");
    } catch (error) { }


  };

  async function verifypayment(bodydata) {
    console.log("hellohjjjjjjj");
    try {
      const verifyUrl =
        "https://goldfish-app-yhaxv.ondigitalocean.app/api/payment/verifypayment";
      const { data } = await axios.post(verifyUrl, {
        bodydata,
      });
      console.log("hello");
      console.log(data);
      // pay now wala popup band krna aur succesful payment wala popup kholna hai
      // setIsOpen5(true);
      setsuccesspayment(true);
    } catch (error) {
      console.log(error);
      //payment failed ka popup
      // setIsOpen6(true);
      setfailurepayment(true);
    }
  }

  useEffect(() => {
    if (restaurentdata) {
      const ids = [];

      restaurentdata.category.forEach((category) => {
        if (category.menuItems) {
          category.menuItems.forEach((item) => {
            if (item.Pincomments) {
              const itemIds = item.Pincomments.map((comment) => comment._id);
              ids.push(...itemIds);
            }
          });
        }
      });

      setPinCommentIds(ids);
    }
  }, [restaurentdata]);

  console.log("pinCommentIds1", pinCommentIds);


  const getFilteredCommentsWithMenuName = (filter) => {
    const filteredCommentsWithMenuName = [];

    if (filter === "new") {
      restaurentdata?.menu?.forEach((section) => {
        const comments = section.comments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6)
          .map((comment) => ({
            ...comment,
            pinned: pinCommentIds.includes(comment._id) ? true : false,
          }));
        filteredCommentsWithMenuName.push({
          menuName: section.name,
          comments,
        });
      });
    } else {
      restaurentdata?.menu.forEach((section) => {
        section?.comments.forEach((item) => {
          if (item.rated === filter) {
            const comment = {
              ...item,
              pinned: pinCommentIds.includes(item._id) ? true : false,
            };
            filteredCommentsWithMenuName.push({
              menuName: section.name,
              comments: [comment],
            });
          }
        });
      });
    }

    return filteredCommentsWithMenuName;
  };


  const filteredCommentsWithMenuName =
    getFilteredCommentsWithMenuName(filterone);
  console.log("Comments with Menu Name", filteredCommentsWithMenuName);

  return (
    <>
      {
        flashLoader ?
          (<FlashScreen />)
          :
          (
            restaurentdata ?
              (
                <div className="w-full h-fit">
                  <MerchantNavbar />
                  {login && (
                    <div
                      className=" absolute top-[60px] sm:top-[70px] w-full  py-[1rem]  min-h-[calc(100vh-60px)] bg-white opacity-95 z-[7000] border-2
            flex justify-center items-center overflow-hidden"
                    >
                      {/* phoneNumber */}
                      {openphno && (
                        <div className="max-w-[320px] w-full h-fit rounded-md border-2 flex flex-col justify-center bg-white">
                          <div className="w-full flex justify-between items-center gap-[4rem] p-[1rem] border-b-2">
                            <p className="font-inter font-[600] text-[1.1rem] leading-[32px]">
                              Login or Signup
                            </p>
                            <IoClose
                              onClick={() => {
                                setLogin(!login);
                              }}
                              className="text-[1.4rem] cursor-pointer"
                            />
                          </div>
                          {/* Mobile Number */}
                          <div className="w-[90%] mx-auto">
                            <p className="font-inter font-[600] text-[1.1rem] leading-[32px] text-[#0000009E] py-[.5rem]">
                              Enter Mobile Number
                            </p>
                            <input
                              className="w-full h-[3rem] focus:outline-none border-2 border-[#FFD600] rounded-md pl-[1rem]"
                              type="tel"
                              placeholder="Enter Your Number"
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              required
                              onKeyDown={(event) => {
                                console.log('key')
                                if (event.key === 'Enter') {
                                  handleSubmit();
                                }
                              }}
                            />
                          </div>
                          <button
                            onClick={handleSubmit}
                            className="w-[90%] mx-auto h-[3rem] my-[1rem] bg-[#FFD600] text-[#004AAD] rounded-md font-inter font-[700] text-[1.1rem] leading-[32px]"
                          >
                            {loading ? "Loading..." : "Continue"}
                          </button>
                          <div id="recaptcha-container"></div>
                        </div>
                      )}

                      {/* otp */}
                      {openotp && (
                        <div className="max-w-[320px] w-full h-fit rounded-md border-2 flex flex-col justify-center relative">
                          <div className=" relative w-full h-fit my-[1rem]">
                            <IoClose
                              onClick={() => {
                                setLogin(!login);
                              }}
                              className="text-[1.4rem] absolute right-[1rem] cursor-pointer"
                            />
                          </div>
                          <p className="w-[90%] mx-auto font-inter font-[500] leading-[32px] text-[#0000009E] py-[.5rem] ">
                            Enter OTP sent on +91 <span>{phoneNumber}</span>
                          </p>
                          <input
                            className="w-[90%] mx-auto
                                 h-[3rem] focus:outline-none border-2 border-[#FFD600] rounded-md pl-[1rem]"
                            type="number"
                            placeholder="Enter Your Otp"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                handleOtpSubmit();
                              }
                            }}
                          />

                          <button
                            onClick={handleOtpSubmit}
                            className="w-[90%] mx-auto h-[3rem] my-[1rem] bg-[#FFD600] text-[#004AAD] rounded-md font-inter font-[700] text-[1.1rem] leading-[32px]"
                          >
                            {loading ? "Loading..." : "Verify"}
                          </button>
                        </div>
                      )}

                      {/* profile */}
                      {openprofile && (
                        <div className="max-w-[320px] w-full h-fit rounded-md border-2 flex flex-col justify-center relative">
                          <p className="font-[600] font-sans text-[1.8rem]">
                            Create Profile
                          </p>

                          {/* form */}
                          <form onSubmit={handleSubmitProfile} className="w-[90%] mx-auto flex flex-col">
                            {/* fullName */}
                            <div className="relative w-full flex flex-col">
                              <label
                                className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                                htmlFor="name"
                              >
                                Full Name:
                              </label>
                              <input
                                className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                                type="text"
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleChangeProfile}
                                required
                              />
                            </div>
                            {/* gender */}
                            <label
                              className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                              htmlFor="gender"
                            >
                              Gender:
                            </label>
                            <select
                              className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                              id="gender"
                              name="gender"
                              value={profileData.gender}
                              onChange={handleChangeProfile}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>

                            {/* dob */}

                            <label
                              className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                              htmlFor="dob"
                            >
                              Date of Birth:
                            </label>
                            <input
                              className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem] w-full"
                              type="date"
                              id="dob"
                              name="dob"
                              value={profileData.dob}
                              onChange={handleChangeProfile}
                              placeholder="only once, never to change"
                            />

                            {/* Anniversary */}

                            <label
                              className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                              htmlFor="anniversary"
                            >
                              Anniversary :
                            </label>
                            <input
                              className="border-2 border-[#EAB308] bg-white w-full h-[3rem] rounded-md px-1 mb-[.5rem]"
                              type="date"
                              id="anniversary"
                              name="anniversary"
                              value={profileData.anniversary}
                              onChange={handleChangeProfile}
                            />

                            {/* email */}

                            <label
                              className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                              htmlFor="email"
                            >
                              Email ID:
                            </label>
                            <input
                              className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                              type="email"
                              id="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleChangeProfile}
                              required
                            />

                            {/* foodPreference */}
                            <label
                              className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                              htmlFor="foodPreference"
                            >
                              Food Preference:
                            </label>
                            <select
                              className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                              id="foodPreference"
                              name="foodPreference"
                              value={profileData.foodPreference}
                              onChange={handleChangeProfile}
                            >
                              <option value="veg">Veg</option>
                              <option value="nonveg">NonVeg</option>
                              <option value="Both">Both</option>
                            </select>
                            {/* terms */}
                            <div className="mb-[.5rem]">
                              <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={profileData.terms}
                                onChange={handleChangeProfile}
                                required
                              />
                              <label className="ml-[.5rem]" htmlFor="terms">
                                I accept the terms and conditions
                              </label>
                            </div>

                            <button
                              className="bg-[#EAB308] font-sen font-[500] px-6 py-3 rounded-md uppercase mb-[.5rem]"
                              type="submit"
                            // onClick={handleSubmitProfile}
                            >
                              {loading ? "Loading..." : "Continue"}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {/* hero section */}
                  <div className="relative w-full h-fit pb-[10vh]">
                    <div className="bg-[#FFD628] w-full h-[20vh] rounded-b-3xl absolute z-[-1]"></div>
                    <div
                      className="bg-[#FFFFFF] w-[95%] md:w-[80%] h-fit mx-auto relative top-[7vh] shadow-md rounded-xl p-[1rem] md:p-[2rem]   justify-between items-center gap-[1rem]">

                      <div className=" flex gap-[1.3rem] justify-between mb-[.5rem]">
                        {/* logo */}
                        <div className=" flex items-center  justify-evenly sm:justify-start">
                          <img
                            src={restaurentdata?.image || foodos}
                            alt="logo"
                            className="w-[50px] md:w-[120px] aspect-square object-cover mix-blend-multiply rounded-full mr-[.3rem] "
                          />
                          <div>
                            <p className="font-Roboto font-[600] text-[1.2rem] leading-[1.2rem] md:text-[2.4rem] md:leading-[2.4rem]">
                              {restaurentdata?.name}
                              {restaurentdata?.outletAddress ? ` - ${restaurentdata?.outletAddress?.split(",")[1]}` : ''}
                            </p>
                            {restaurentdata?.cuisineServed && (
                              <span className="text-[#0f172aca] font-Roboto font-[500] text-[.9rem] md:text-[1.2rem] md:leading-[1.8rem]">
                                {restaurentdata.cuisineServed.map((cuisine, index) => (
                                  <React.Fragment key={index}>
                                    {cuisine}
                                  </React.Fragment>
                                ))}
                              </span>
                            )}

                          </div>
                        </div>

                        {/* recommand count */}
                        <div className="p-[.5rem] sm:p-[1rem] bg-[#0000001A] w-fit h-fit rounded-lg">
                          <div className="w-fit flex gap-[1rem] items-center">
                            <img
                              src={groupImage}
                              alt="groupImage"
                              className="h-[20px] sm:h-[30px] lg:h-[40px] aspect-auto"
                            />
                            <p className="block font-Roboto font-[600] md:text-[1.4rem] leading-[1.5rem]">
                              {restaurentdata?.recommendationCount}
                            </p>
                          </div>
                          <p className="block font-Roboto font-[400] text-[.9rem] sm:text-[1.1rem] leading-[1.5rem]  mt-[.5rem] text-center">
                            Recommendation
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="w-full flex flex-wrap gap-[.2rem] md:gap-[1rem] items-center sm:justify-start">

                          {/* Youtube */}
                          {
                            restaurentdata?.youtubeLink &&
                            <button
                              onClick={() => {
                                console.log("Youtube", `${restaurentdata?.youtubeLink}`);
                                window.open(
                                  youtubeLink,
                                  "_blank"
                                );
                              }}
                              className="p-[.3rem] sm:p-[.6rem] border-[2.5px] border-[#FFD628] rounded-lg font-inter font-[600] "
                            >
                              <img
                                src={Youtube}
                                alt="Youtube"
                                className="w-[15px] sm:w-[30px] aspect-square"
                              />
                            </button>
                          }
                          {/* instagram */}
                          {
                            restaurentdata?.instaLink &&
                            <button
                              onClick={() => {
                                console.log("instagram", `${restaurentdata?.instaLink}`);
                                window.open(
                                  instaLink,
                                  "_blank"
                                );
                              }}
                              className="p-[.3rem] sm:p-[.6rem] border-[2.5px] border-[#FFD628] rounded-lg font-inter font-[600] "
                            >
                              <img
                                src={Instagram}
                                alt="Instagram"
                                className="w-[15px] sm:w-[30px] aspect-square"
                              />
                            </button>
                          }
                          {/* Facebook */}
                          {
                            restaurentdata?.facebookLink &&
                            <button
                              onClick={() => {
                                console.log("Facebook", `${restaurentdata.facebookLink}`);
                                window.open(
                                  facebookLink,
                                  "_blank"
                                );
                              }}
                              className="p-[.3rem] sm:p-[.6rem] border-[2.5px] border-[#FFD628] rounded-lg font-inter font-[600] "
                            >
                              <img
                                src={Facebook}
                                alt="Facebook"
                                className="w-[15px] sm:w-[30px] aspect-square"
                              />
                            </button>
                          }
                        </div>

                        <div className="flex gap-[.5rem] items-center h-fit">
                          {/* recommand */}
                          <button
                            // onClick={handleRecommand}
                            onClick={() => {
                              if (User._id) {
                                handleRecommand();
                              } else {
                                setLogin(true);
                                setOpenPhno(true);
                              }
                            }}
                            // id="recommand"
                            className={` px-[.5rem] py-[.2rem] sm:px-[1rem] 
                          sm:py-[.85rem] border-[2.5px] border-[#FFD628] rounded-lg 
                          font-inter font-[600] sm:text-[1rem] text-[.8rem] 
                          ${recommend ? ('bg-[#FFD628]') : ('bg-white')}`}
                          >
                            Recommend
                          </button>
                          {/* share */}
                          <button
                            onClick={() => {
                              setShareVisible(!shareVisible);
                            }}
                            className="p-[.3rem] sm:p-[1rem] border-[2.5px] border-[#FFD628] rounded-lg font-inter font-[600] "
                          >
                            <MdOutlineShare className="sm:text-[1.2rem]" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center items-center">
                        {/* payment button */}
                        {
                          restaurentdata?.ispayment &&
                          <button
                            onClick={() => {
                              if (User._id) {
                                setPaymentVisible(!paymentVisible);
                              } else {
                                setLogin(true);
                                setOpenPhno(true);
                              }
                            }}
                            className="bg-[#004AAD] rounded-lg flex gap-[1rem] items-center justify-center sm:px-[1rem] text-white sm:py-[.5rem] w-full max-w-[800px] mt-[1rem] py-[.3rem]"
                          >
                            <p className=" font-sans font-[600] sm:text-[1.2rem] ">
                              Pay Bill
                            </p>
                            <FaAnglesRight className="sm:text-[1.2rem]" />
                          </button>
                        }
                      </div>
                    </div>
                  </div>

                  <div className=" sticky top-0 pt-[2rem] w-[95%] md:w-[80%] mx-auto bg-white z-[100] ">
                    <div className=" relative top-[-2vh] ">
                      <div className="flex gap-[.5rem] px-[1rem] overflow-scroll hideScroller mt-[.5rem]">
                        {/* menus */}
                        <button
                          onClick={() => {
                            setMenus(true);
                            setoffers(false);
                            setRecomendations(false);
                            setFavourite(false);
                          }}
                          className={` font-inter font-[600] text-[1rem]  px-[1rem] py-[.3rem]  border-2 border-[#00000099] rounded-md ${menus
                            ? "text-[#004AAD] bg-[#F7D128] border-none "
                            : "text-black"
                            }`}
                        >
                          Menu
                        </button>
                        {/* Recomendations */}
                        <button
                          onClick={() => {
                            setRecomendations(true);
                            setoffers(false);
                            setMenus(false);
                            setFavourite(false);
                          }}
                          className={` font-inter font-[600] text-[1rem]  px-[1rem] py-[.3rem] rounded-md border-2 border-[#00000099] ${Recomendations
                            ? "text-[#004AAD] bg-[#F7D128] border-none "
                            : "text-black"
                            }`}
                        >
                          Recomendations
                        </button>
                        {/* Favourite */}
                        {User?._id && (
                          <button
                            onClick={() => {
                              setRecomendations(false);
                              setoffers(false);
                              setMenus(false);
                              setFavourite(true);
                            }}
                            className={` font-inter font-[600] text-[1rem] px-[1rem] py-[.3rem] rounded-md border-2 border-[#00000099] ${Favourite
                              ? "text-[#004AAD] bg-[#F7D128] border-none "
                              : "text-black"
                              }`}
                          >
                            Favourite
                          </button>
                        )}
                        {/* events */}
                        {/* <button
                      onClick={() => {
                        setMenus(false);
                        setEvents(!events);
                        setoffers(false);
                        setFavourite(false);
                        setRecomendations(false);
                      }}
                      className={` font-inter font-[600] text-[1rem] px-[1rem] py-[.3rem] border-2 border-[#00000099] rounded-md ${events
                        ? "text-[#004AAD] bg-[#F7D128] border-none"
                        : "text-black"
                        }`}
                    >
                      Events
                    </button> */}
                        {/* offers */}
                        <button
                          onClick={() => {
                            setMenus(false);
                            setoffers(true);
                            setFavourite(false);
                            setRecomendations(false);
                          }}
                          className={` font-inter font-[600] text-[1rem] px-[1rem]  py-[.3rem] border-2 border-[#00000099]  rounded-md ${offers
                            ? "text-[#004AAD] bg-[#F7D128] border-none"
                            : "text-black"
                            } `}
                        >
                          Offers
                        </button>
                      </div>

                      {menus && (
                        <div className=" flex flex-wrap  gap-[.5rem] justify-between items-center py-[1.5rem] sm:py-[2rem] overflow-hidden border-b-2">
                          <div className="relative w-fit  shadow-xl rounded-md border-2 ">
                            <input
                              className=" w-[220px] sm:w-[400px] focus:outline-none h-[2.4rem] sm:h-[3rem] px-[1rem]"
                              type="text"
                              placeholder="Search for dish"
                              value={search || ""}
                              onChange={handleSearch}
                            />
                            <CiSearch className=" absolute right-[1rem] top-[50%] translate-y-[-50%] text-[1.3rem]" />
                          </div>
                          <div className="flex gap-[1rem] items-center w-fit">
                            <div
                              onClick={() => {
                                setIsOn(!isOn);
                              }}
                              className="p-[.5rem] rounded-md border-2 flex items-center justify-start w-fit h-fit cursor-pointer "
                            >
                              <div
                                className={`${isOn ? "bg-[#67CE67]" : "bg-[#ED4F4F]"
                                  } rounded-full w-[10px] aspect-square`}
                              ></div>
                            </div>
                            <ToggleSwitch />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* menufilter */}
                  <div
                    className={`${filter
                      ? "translate-y-0 opacity-100 transition-all duration-300 ease-in-out"
                      : "translate-y-full opacity-0 transition-all duration-300 ease-in-out"
                      } w-full max-w-[320px] bg-white shadow-lg py-[1rem] px-[1.5rem] rounded-xl border-2  text-center fixed bottom-0 left-[50%] translate-x-[-50%] z-[1000] h-fit`}
                  >
                    <div className="text-[#5E5E5E] font-inter font-[700] text-[1.1rem] sm:text-[1.2rem] flex justify-between items-center border-b-2 py-[.8rem] gap-[1rem] ">
                      <p>Browse Menu</p>
                      <IoIosCloseCircleOutline
                        onClick={() => {
                          setFilter(!filter);
                        }}
                        className="text-[2rem] cursor-pointer text-[#426CFF] hover:text-black"
                      />
                    </div>
                    <div className=" overflow-y-scroll h-[30vh] hideScroller">
                      {restaurentdata?.category.map((category, index) => (
                        <div key={index} className="">
                          <p
                            onClick={() => {
                              scrollToElement(category?.name);
                              setFilter(!filter);
                              toggleCategory(category?.name);
                            }}
                            className="pt-[1.4rem] font-inter font-[400] text-[1.3rem] cursor-pointer"
                          >
                            {category?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* menucomment */}
                  <div>
                    {commentVisible &&
                      <Menucomment resId={id} setOpenPhno={setOpenPhno} />
                    }
                  </div>

                  {/* update profile */}
                  <div
                    className={`${editprofile
                      ? "translate-y-0 opacity-100 transition-all duration-300 ease-in-out"
                      : "translate-y-full opacity-0 transition-all duration-300 ease-in-out"
                      } w-full max-w-[400px] bg-white shadow-lg py-[1rem] px-[1.5rem] rounded-xl border-2  text-center fixed bottom-0 left-[50%] translate-x-[-50%] z-[1000] h-fit`}
                  >
                    <div className="text-[#5E5E5E] font-inter font-[700] text-[1.1rem] sm:text-[1.2rem] flex justify-between items-center border-b-2 py-[.8rem] gap-[1rem] ">
                      <p>Update Profile</p>
                      <IoIosCloseCircleOutline
                        onClick={() => {
                          setEditProfile(!editprofile);
                        }}
                        className="text-[2rem] cursor-pointer text-[#426CFF] hover:text-black"
                      />
                    </div>
                    <div className=" w-full h-[70vh] overflow-y-scroll hideScroller rounded-md flex flex-col relative">
                      {/* form */}
                      <form className="w-[90%] mx-auto flex flex-col">
                        {/* fullName */}
                        <div className="relative w-full flex flex-col">
                          <label
                            className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                            htmlFor="name"
                          >
                            Full Name:
                          </label>
                          <input
                            className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={editprofileData?.name}
                            onChange={handleEditProfile}
                          />
                        </div>
                        {/* gender */}
                        <label
                          className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                          htmlFor="gender"
                        >
                          Gender:
                        </label>
                        <select
                          className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                          id="gender"
                          name="gender"
                          value={editprofileData?.gender}
                          onChange={handleEditProfile}
                          required
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>

                        {/* dob */}

                        <label
                          className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                          htmlFor="dob"
                        >
                          Date of Birth:
                        </label>
                        <input
                          className="border-2 border-[#EAB308] bg-white h-[3rem] w-full rounded-md px-1 mb-[.5rem] text-[#004AAD]"
                          type="date"
                          id="dob"
                          name="dob"
                          placeholder="only once, never to change"
                          required
                          value={editprofileData?.dob}
                          onChange={handleEditProfile}
                          disabled={User?.dob}
                        />

                        {/* Anniversary */}

                        <label
                          className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                          htmlFor="anniversary"
                        >
                          Anniversary :
                        </label>
                        <input
                          className="border-2 border-[#EAB308] bg-white w-full h-[3rem] rounded-md px-1 mb-[.5rem]"
                          type="date"
                          id="anniversary"
                          name="anniversary"
                          value={editprofileData?.anniversary}
                          onChange={handleEditProfile}
                          disabled={editprofileData?.anniversary == null}
                        />

                        {/* email */}

                        <label
                          className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                          htmlFor="email"
                        >
                          Email ID:
                        </label>
                        <input
                          className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                          type="email"
                          id="email"
                          name="email"
                          required
                          onChange={handleEditProfile}
                          value={editprofileData?.email}
                        />

                        {/* foodPreference */}
                        <label
                          className="bg-white inline px-[1rem] w-fit h-fit relative top-[10px] left-[15px]"
                          htmlFor="foodPreference"
                        >
                          Food Preference:
                        </label>
                        <select
                          className="border-2 border-[#EAB308] bg-white h-[3rem] rounded-md px-1 mb-[.5rem]"
                          id="foodPreference"
                          name="foodPreference"
                          value={editprofileData?.foodPreference}
                          onChange={handleEditProfile}
                          required
                        >
                          <option value="veg">Veg</option>
                          <option value="nonveg">NonVeg</option>
                          <option value="Both">Both</option>
                        </select>

                        <button
                          className="bg-[#EAB308] font-sen font-[500] px-6 py-3 rounded-md uppercase my-[.5rem]"
                          type="button"
                          onClick={handleSubmitEditProfile}
                        >
                          {loading ? "Loading..." : "Save"}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* MerchantShare */}
                  <MerchantShare />

                  {/* successpayment popup */}
                  {successPayment && <SuccessPayment amountToPay={amountToPay} />}

                  {/* failurepayment popup */}
                  {failurePayment && (
                    <FailurePayment
                      paymentVisible={paymentVisible}
                      setPaymentVisible={setPaymentVisible}
                    />
                  )}

                  {/* paybill start */}
                  <div className="w-full h-0 relative">
                    <div
                      className={`fixed bottom-0 left-[50%] translate-x-[-50%] max-w-[400px] w-full hideScroller  z-[3000] bg-transparent h-fit border-2 overflow-scroll comment ${paymentVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                        }`}
                    >
                      <div className="w-full h-[30vh] bg-black opacity-45"></div>
                      <div className="bg-white border-2 overflow-scroll h-[70vh]">
                        <IoClose
                          onClick={() => {
                            setPaymentVisible(!paymentVisible);
                          }}
                          className="absolute right-[1rem] top-[32vh] text-[#426CFF] text-[1.5rem] cursor-pointer"
                        />

                        <div className="w-full h-fit mt-[2rem]">
                          {/* logo-image */}
                          <img
                            src={restaurentdata?.image || foodos}
                            alt="merchant-logo"
                            className="w-[100px] aspect-square rounded-full mx-auto"
                          />
                          <p className="font-inter font-[600] text-[1.1rem] leading-[32px] text-center">
                            Paying to FOODOOS
                          </p>
                          <p className="font-inter font-[400] leading-[32px] text-center">
                            AMP Baisakhi Mall,Salt Lake
                          </p>

                          {/* pay-amount */}
                          <div className="w-fit flex bg-[#D9D9D938] justify-center items-center  px-[1rem] py-[.5rem] mx-auto rounded-md my-[.5rem]">
                            <p className="font-inter font-[400] leading-[24px] text-[35px] text-[#262627]">
                              ₹
                            </p>
                            <input
                              className="w-[7rem] h-[3rem] focus:outline-none bg-transparent text-[1.5rem] text-[#262627C7] font-[700] font-inter  px-[.5rem]"
                              type="number"
                              min="1"
                              placeholder="400"
                              value={paymentamount}
                              onChange={(e) => {
                                setPaymentAmount(e.target.value);
                                setamountToPay(e.target.value);
                                console.log(paymentamount);
                              }}
                            />
                          </div>

                          <div className="flex justify-center items-center gap-[.5rem] py-[1rem]">
                            <div className="w-[110px] h-[.7px] bg-[#00000057]"></div>
                            <p className="font-[500] font-inter leading-[19.36px] uppercase">
                              Redeem Offers
                            </p>
                            <div className="w-[110px] h-[.7px] bg-[#00000057]"></div>
                          </div>

                          {/* offers */}

                          {restaurantOffers?.length == 0 ? (
                            <div className="w-full flex flex-col items-center p-[1rem] ">
                              <img
                                src={eventnofound}
                                alt="eventnofound"
                                className="w-[40%] aspect-auto"
                              />
                              <p className=" font-Sen font-[700] text-[1.4rem]  leading-[3rem] text-center">
                                Opps ! no offers found
                              </p>
                              <p className=" font-Sen font-[400]  leading-[1rem] text-[#525C67] text-center">
                                Restaurant dont have any active offers
                              </p>
                            </div>
                          ) : (
                            <div
                              className={` flex gap-[1rem] overflow-x-scroll hideScroller`}
                            >
                              {restaurantOffers.map((offer, index) => (
                                <MerchantOffers key={index} offer={offer} />
                              ))}
                            </div>
                          )}

                          {/* payment */}

                          <div className="flex justify-center items-center gap-[.5rem] py-[1rem]">
                            <div className="w-[110px] h-[.7px] bg-[#00000057]"></div>
                            <p className="font-[500] font-inter leading-[19.36px] uppercase">
                              Bill Summary
                            </p>
                            <div className="w-[110px] h-[.7px] bg-[#00000057]"></div>
                          </div>

                          <div className="w-[90%] mx-auto border-2 rounded-xl p-[1rem]">
                            <div className="flex justify-between items-center my-[.25rem]">
                              <p className="font-[400] font-inter leading-[19.36px] uppercase">
                                Bill Amount{" "}
                              </p>
                              <p className="text-[#262627C7]">₹ {paymentamount}</p>
                            </div>

                            <div className="flex justify-between items-center my-[.25rem] ">
                              <p className="font-[400] font-Roboto leading-[19.36px] text-[#004AAD]">
                                offers
                              </p>
                              <p className="text-[#004AAD]">-₹ 0</p>
                            </div>

                            <div className="flex justify-between items-center my-[.25rem] ">
                              <p className="font-[400] font-Roboto leading-[19.36px]">
                                Convenience fee
                              </p>
                              <p className="text-[#262627C7]">₹ 0</p>
                            </div>

                            <div className="w-full h-[1px] bg-[#00000057] my-[1rem]"></div>

                            <div className="flex justify-between items-center my-[.25rem] ">
                              <p className="font-[600] font-inter leading-[19.36px]">
                                To be paid
                              </p>
                              <p className="text-[#262627C7]">₹ {paymentamount}</p>
                            </div>
                          </div>

                          <div className="w-[90%] mx-auto h-fit my-[2rem] py-[1rem] border-2 rounded-3xl">
                            <div className="flex justify-around items-center">
                              <div className="flex gap-[1rem] items-center">
                                <img
                                  src={termsImage}
                                  alt="termsImage"
                                  className="h-[20px] aspect-auto"
                                />
                                <p className="text-[#262627] font-inter font-[700] leading-[24px]">
                                  Terms & Conditions
                                </p>
                              </div>

                              {!ishidden ? (
                                <FaChevronUp
                                  className=" cursor-pointer"
                                  onClick={() => {
                                    setIsHidden(!ishidden);
                                  }}
                                />
                              ) : (
                                <FaChevronDown
                                  className=" cursor-pointer"
                                  onClick={() => {
                                    setIsHidden(!ishidden);
                                  }}
                                />
                              )}
                            </div>
                            <div
                              className={`border-dotted border-2 w-[90%] mx-auto   ${ishidden
                                ? "opacity-0 h-0 duration-200 transition-opacity transition-height"
                                : "opacity-100 h-auto duration-200 transition-opacity transition-height my-[1rem] p-[1rem]"
                                }`}
                            >
                              <p className="my-[.5rem] font-inter font-[400] text-[12px] leading-[19.2px] text-[#262627]">
                                No refund on any purchase are possible{" "}
                              </p>
                              <p className="my-[.5rem] font-inter font-[400] text-[12px] leading-[19.2px] text-[#262627]">
                                Refunds are only processed by the merchants
                              </p>
                              <p className="my-[.5rem] font-inter font-[400] text-[12px] leading-[19.2px] text-[#262627]">
                                By paying, you consent to receive communications via email,
                                whatsapp from the associated entities.
                              </p>
                            </div>
                          </div>

                          <button className="  bg-[#4BCA59] text-[#ffffff] font-[700] font-Roboto max-w-[300px] w-full h-[3.6rem] mx-auto mb-[1rem] rounded-md flex justify-center items-center gap-[1rem]">
                            <FaWhatsapp className="text-[2rem]" /> WhatsApp
                          </button>
                        </div>

                        <div className="sticky bottom-0 w-full bg-white border-2 p-[1rem] rounded-t-3xl">
                          <button
                            onClick={handlePayment}
                            className="  bg-[#004AAD] text-[#ffffff] font-[700] font-Roboto w-[300px]  h-[3.6rem] mx-auto  rounded-md block"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* menu */}
                  {menus && (
                    <div>

                      {
                        restaurentdata.menu.length > 0 ?
                          (
                            <div>
                              {/* browse button */}
                              <button
                                onClick={() => {
                                  setFilter(!filter);
                                }}
                                className="px-[1rem] py-[.5rem] bg-[#FFD628] flex justify-around gap-[.5rem] items-center rounded-lg fixed bottom-[2rem] left-[50%] translate-x-[-50%] z-[100]"
                              >
                                <img src={Restaurantmenu} alt="Restaurantmenu" />
                                <p className="font-inter font-[400] text-[1rem] leading-[1.5rem]">
                                  Browse Menu
                                </p>
                              </button>
                              {/* searchMenuItems */}
                              {searchMenuItems && (
                                <div className="w-[95%] md:w-[80%] mx-auto">
                                  <p className="font-Roboto font-[500] text-[1.4rem] leading-[3rem]">
                                    Search Results
                                  </p>
                                  {
                                    searchMenuItems.length == 0 ? (
                                      <div>
                                        <img src={noproductfound} alt="noproductfound" className="max-w-[200px] mx-auto aspect-auto w-full" />
                                      </div>
                                    )
                                      : (
                                        <div className={`w-full scroller-container `}>
                                          <div
                                            className={`flex gap-[1rem] p-[.5rem] overflow-x-scroll scroller hideScroller w-[${searchMenuItems.length * 240
                                              }px]`}
                                            style={{ overscrollBehaviorX: "contain" }}
                                          >
                                            {searchMenuItems.map((items, index) =>
                                              isOn
                                                ? items.veg === "Yes" && (
                                                  <MenuCard key={index} items={items} />
                                                )
                                                : items.active && <MenuCard key={index} items={items} />
                                            )}
                                          </div>
                                        </div>
                                      )
                                  }
                                </div>
                              )}
                              {/* mostRecomended */}
                              {mostRecomended && (
                                <div className="w-[95%] md:w-[80%] mx-auto">
                                  <div
                                    onClick={toggleMostRecommended}
                                    id="mostRecomended"
                                    className="w-full flex justify-between items-center  p-[.5rem] px-[1rem] rounded-md"
                                  >
                                    <p className="font-Roboto font-[500] text-[1.4rem] leading-[3rem]">
                                      Most Recommended ({mostRecomended.length})
                                    </p>
                                    {showAllMostRecommended ? (
                                      <FaAngleUp className={`text-[1.4rem] cursor-pointer`} />
                                    ) : (
                                      <FaAngleDown className={`text-[1.4rem] cursor-pointer`} />
                                    )}
                                  </div>

                                  <div
                                    className={`w-full scroller-container ${showAllMostRecommended
                                      ? "h-auto transition-height duration-300 ease-in-out"
                                      : "h-0"
                                      }`}
                                  >
                                    <div
                                      className={`flex gap-[1rem] p-[.5rem] overflow-x-scroll scroller hideScroller w-[${mostRecomended.length * 240
                                        }px]`}
                                      style={{ overscrollBehaviorX: "contain" }}
                                    >
                                      {mostRecomended?.map((items, index) =>
                                        isOn
                                          ? items.veg === "Yes" && (
                                            <MenuCard key={index} items={items} />
                                          )
                                          : items.active && <MenuCard key={index} items={items} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/*Rest Restaurantmenu */}
                              {restaurentdata?.category.map(
                                (category, index) =>
                                  category.active && (
                                    <div

                                      id={category?.name}
                                      key={index}
                                      className="w-[95%] md:w-[80%] mx-auto"
                                    >
                                      <div className="w-full h-fit">
                                        <div onClick={() => toggleCategory(category?.name)} className="w-full flex justify-between items-center my-[1rem] p-[.5rem] px-[1rem] rounded-md">
                                          <p className="font-Roboto font-[500] text-[1.4rem] leading-[3rem]">
                                            {category?.name} (
                                            {
                                              category?.menuItems.filter(
                                                (menuItem) => menuItem.active
                                              ).length
                                            }
                                            )
                                          </p>
                                          {showAllCategories[category?.name] ? (
                                            <FaAngleUp className={`text-[1.4rem] cursor-pointer`} />
                                          ) : (
                                            <FaAngleDown
                                              className={`text-[1.4rem] cursor-pointer`}
                                            />
                                          )}
                                        </div>

                                        <div
                                          className={`w-full scroller-container ${showAllCategories[category?.name]
                                            ? "h-auto transition-height duration-300 ease-in-out"
                                            : "h-0"
                                            }`}
                                        >
                                          <div
                                            className={`flex gap-[1rem] p-[.5rem] overflow-x-scroll scroller hideScroller w-[${category?.menuItems.length * 240
                                              }px]`}
                                            style={{ overscrollBehaviorX: "contain" }}
                                          >
                                            {category?.menuItems.map((items, index) =>
                                              isOn
                                                ? items.veg === "Yes" && (
                                                  <MenuCard key={index} items={items} />
                                                )
                                                : items.active && (
                                                  <MenuCard key={index} items={items} />
                                                )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                              )}
                            </div>
                          )

                          : (
                            <div>
                              <img src={noproductfound} alt="noproductfound" className="max-w-[400px] mx-auto aspect-auto w-full" />
                            </div>
                          )
                      }



                      {/* footer */}
                      <div className="w-[90%] h-fit px-[2rem] py-[1rem] border-2 mx-auto border-black rounded-md mb-[6rem] mt-[1rem]">
                        <p className="text-[20px] font-inter font-[700] leading-[40px]">
                          {restaurentdata?.name}
                        </p>
                        <div className="flex sm:flex-row flex-col justify-between gap-[1rem]">
                          <div>
                            <div className="flex gap-[.5rem] items-center my-[.5rem]">
                              <IoLocationOutline className="text-[1.4rem]" />
                              <p className="text-[16px] font-inter font-[400] leading-[24px]">
                                {restaurentdata?.outletAddress}
                              </p>
                            </div>
                            <div className="flex gap-[.5rem] items-center my-[.5rem]">
                              <FaPhoneAlt className="text-[1.2rem]" />
                              <p className="text-[16px] font-inter font-[400] leading-[24px]">
                                + 91 {restaurentdata?.contact}
                              </p>
                            </div>
                            <div className="flex gap-[.5rem] items-center my-[.5rem]">
                              <img src={fssai} alt="fssai" />
                              <p className="text-[16px] font-inter font-[400] leading-[24px]">
                                {restaurentdata?.fssaiLicenseNo}
                              </p>
                            </div>
                          </div>
                          <div className="">
                            <p className="inline text-[18px] font-inter font-[600] leading-[24px] text-[#106CF6] border-b-2 border-[#106CF6]">
                              Powered By
                            </p>
                            <img
                              src={logo}
                              alt="logo"
                              className="h-[4rem] aspect-auto mt-[1rem] relative left-[-.5rem]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* offers  */}
                  {offers && (
                    <div>
                      {restaurantOffers?.length == 0 ? (
                        <div className="w-full flex flex-col items-center p-[2rem] pb-[6rem]">
                          <img
                            src={offersImg}
                            alt="offersImg"
                            className="w-[200px] md:w-[260px] aspect-auto"
                          />
                          <p className=" font-Sen font-[700] text-[1.6rem] md:text-[2.4rem] leading-[3rem] text-center">
                            Opps ! no offers found
                          </p>
                          <p className=" font-Sen font-[400] md:text-[1.6rem] md:leading-[2rem] text-[#525C67] text-center">
                            Restaurant dont have any active offers
                          </p>
                        </div>
                      ) : (
                        <div className="w-[90%] mx-auto h-fit flex flex-wrap gap-[.5rem] items-center justify-center my-[1rem]">
                          {restaurantOffers.map((offer, index) => (
                            <MerchantOffers key={index} offer={offer} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* events  */}
                  {/* {events && (
        <div>
          {restaurantEvents?.length === 0 ? (
            <div className="w-full flex flex-col items-center p-[2rem] pb-[6rem]">
              <img
                src={eventnofound}
                alt="eventnofound"
                className="max-w-[260px] aspect-auto"
              />
              <p className=" font-Sen font-[700] text-[1.6rem] md:text-[2.4rem] leading-[3rem] text-center">
                Opps ! no event found
              </p>
              <p className=" font-Sen font-[400] md:text-[1.6rem] md:leading-[2rem] text-[#525C67] text-center">
                Restaurant dont have any upcomming event{" "}
              </p>
            </div>
          ) : (
            <div className="w-[90%] mx-auto h-fit flex flex-wrap justify-center my-[1rem]">
              {restaurantEvents.map((event, index) => (
                <MerchantEvents key={index} event={event} />
              ))}
            </div>
          )}
        </div>
      )} */}

                  {/* Favourite */}
                  {Favourite && (
                    <div>
                      {favoriteMenu === null ? (
                        <div className="w-full flex flex-col items-center p-[2rem] pb-[6rem] mt-[1rem]">
                          <img
                            src={nofavorite}
                            alt="nofavorite"
                            className="max-w-[360px] aspect-auto"
                          />
                          <p className=" font-Sen font-[700] text-[1.6rem] md:text-[2.4rem] md:leading-[3rem] text-center">
                            Create your custom favourite food item list!
                          </p>
                          <p className=" font-Sen font-[400] md:text-[1.6rem] md:leading-[2rem] text-[#525C67] text-center">
                            Be the first to recommend dishes in this restaurant
                          </p>
                        </div>
                      ) : (
                        <div className="w-[90%] mx-auto h-fit flex gap-[1rem] overflow-x-scroll hideScroller my-[1rem] py-[1rem]">
                          {favoriteMenu?.map((items, index) => (
                            <MenuCard key={index} items={items} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recomendations */}
                  {Recomendations && (
                    restaurentdata.menu.length === 0 ?
                      (<div className="w-full flex flex-col items-center p-[2rem] pb-[6rem] mt-[1rem]">
                        <img src={noproductfound} alt="noproductfound" className="max-w-[260px] aspect-auto" />
                        <p className="text-center font-[700] font-inter text-[1.4rem]">No Menu's Found</p>
                      </div>)
                      :
                      (
                        <div>
                          {restaurentdata?.menu[0]?.comments.length === 0 ? (
                            <div className="w-full flex flex-col items-center p-[2rem] pb-[6rem]">
                              <img
                                src={noReccomandation}
                                alt="noReccomandation"
                                className="max-w-[260px] aspect-auto"
                              />
                              <p className=" font-Sen font-[700] text-[1.6rem] md:text-[2.4rem] md:leading-[3rem] text-center">
                                Opps ! No Recomendation found
                              </p>
                              <p className=" font-Sen font-[400] md:text-[1.6rem] md:leading-[2rem] text-[#525C67] text-center">
                                Come on ! be the first to recommend
                              </p>

                              <div className="flex justify-center items-center mt-[10vh]">
                                <p className="w-[100px] h-[.5px] bg-[#00000057]"></p>
                                <div className="text-center px-[.5rem]">
                                  <p className="leading-[.9rem]">Recommend</p>
                                  <p>now</p>
                                </div>
                                <p className="w-[100px] h-[.5px] bg-[#00000057]"></p>
                              </div>

                              {/* Recommend menu by user */}
                              <div className="w-full h-fit  mt-[4rem] scroller-container">
                                <div
                                  className={`flex gap-[1rem] px-[.5rem] overflow-x-scroll scroller hideScroller w-[${restaurentdata?.menu.length * 280
                                    }px]`}
                                >
                                  {restaurentdata?.menu.map((items, index) => (
                                    <MenuCard key={index} items={items} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="sm:w-[90%] mx-auto h-fit flex flex-wrap justify-center my-[1rem]">
                              <div className="w-full sticky top-0 bg-white z-[100] pt-[1rem] border-b-2">
                                <p className="font-inter font-[700] leading-[24px] text-[#262627] text-[1.6rem] px-[1rem]">
                                  Recomendations by customers
                                </p>
                                <div className="w-full flex gap-[1rem] items-center my-[1rem] overflow-scroll hideScroller px-[1rem]">
                                  <button
                                    onClick={() => {
                                      // setGood(false);
                                      // setNewone(!newone);
                                      // setNotliked(false);
                                      // setMustTry(false);
                                      setFilterone("new");
                                      toast('recent messages!', {
                                        icon: '🆕',
                                      });
                                    }}
                                    className={`${filterone === "new" && "bg-[#FFD628]"
                                      } px-[1.2rem] py-[.5rem] rounded-md font-[500] text-[1rem] leading-[1.15rem] border-2 text-nowrap`}
                                  >
                                    New
                                  </button>
                                  <button
                                    onClick={() => {
                                      // setGood(false);
                                      // setNewone(false);
                                      // setNotliked(!notlikedone);
                                      // setMustTry(false);
                                      setFilterone("notLiked");
                                      toast('not liked messages!', {
                                        icon: '😞',
                                      });
                                    }}
                                    className={` ${filterone === "notLiked" && "bg-[#FFD628]"
                                      } px-[1.2rem] py-[.5rem] rounded-md font-[500] text-[1rem] leading-[1.15rem] border-2 text-nowrap`}
                                  >
                                    Not Liked
                                  </button>
                                  <button
                                    onClick={() => {
                                      // setGood(!goodone);
                                      // setNewone(false);
                                      // setNotliked(false);
                                      // setMustTry(false);
                                      setFilterone("liked");
                                      toast('liked messages!', {
                                        icon: '👍',
                                      });
                                    }}
                                    className={` ${filterone === "liked" && "bg-[#FFD628]"
                                      } px-[1.2rem] py-[.5rem] rounded-md font-[500] text-[1rem] leading-[1.15rem] border-2 text-nowrap`}
                                  >
                                    Liked
                                  </button>
                                  <button
                                    onClick={() => {
                                      // setGood(false);
                                      // setNewone(false);
                                      // setNotliked(false);
                                      // setMustTry(!musttryone);
                                      setFilterone("mustTry");
                                      toast('mustTry!', {
                                        icon: '🤩',
                                      });
                                    }}
                                    className={` ${filterone === "mustTry" && "bg-[#FFD628]"
                                      }  px-[1.2rem] py-[.5rem] rounded-md font-[500] text-[1rem] leading-[1.15rem] border-2 text-nowrap`}
                                  >
                                    Must try
                                  </button>
                                </div>
                              </div>

                              <div className="w-[100%] h-fit">
                                {filteredCommentsWithMenuName.length == 0 ? (
                                  <div className="w-full h-fit flex flex-col items-center pt-[1rem]">
                                    <img
                                      src={recommand}
                                      alt="recommand-Image"
                                      className="max-w-[400px] w-[90%] aspect-auto object-contain"
                                    />
                                    <p className="text-[1.4rem] font-inter font-[400]  capitalize">
                                      Be first to recommand
                                    </p>
                                  </div>
                                ) : (
                                  <div className="w-full h-fit flex flex-col items-center sm:items-start">
                                    {filteredCommentsWithMenuName?.map((menu, index) => (
                                      <div
                                        key={index}
                                        className="w-full h-fit flex sm:flex-wrap  flex-col sm:gap-[.5rem] items-center sm:justify-start "
                                      >
                                        {menu?.comments.map((comment, index) => (
                                          <div
                                            className=" relative  w-[90%] sm:w-[360px] sm:min-w-[360px] h-fit  mx-auto border-[1.5px] my-[1rem] rounded-[15px] border-[#00000080]"
                                            key={index}
                                          >
                                            {/* head */}
                                            <div className="w-full flex justify-between items-center border-b-[.5px] border-[#00000080] px-[1rem] py-[.5rem]">
                                              <img
                                                src={defaultuser}
                                                alt="dummyimage"
                                                className="w-[50px] aspect-square rounded-full"
                                              />
                                              <p className="font-inter font-[500] text-[#334253]">
                                                {comment?.userId?.name || "Anonymous"}
                                              </p>
                                              <p className="font-inter font-[400] text-[#0F172A] flex gap-[.5rem] items-center">
                                                {calculateTimeDifference(comment?.createdAt)}
                                                {comment.pinned && (
                                                  <TbPinnedFilled className="text-[#426CFF]" />
                                                )}
                                              </p>
                                            </div>
                                            {/* body */}
                                            <p className="w-full px-[1rem] h-fit min-h-[150px] font-inter font-[400] text-[#0F172A] pt-[1rem] pb-[3rem] text-[1rem]">
                                              {comment?.description}
                                            </p>
                                            {/* comment footer */}
                                            <div className="flex  justify-between px-[1rem] items-center absolute w-full left-0 bottom-2">
                                              <p className="font-Roboto font-[500] text-[#000000]">{menu.menuName}</p>
                                              {comment?.rated == "mustTry" && (
                                                <div className="w-fit h-fit mt-[.5rem] flex flex-col items-center ">
                                                  <img
                                                    src={musttry}
                                                    alt="musttry"
                                                    className="w-[20px] aspect-square"
                                                  />
                                                  <p className="font-inter font-[400] mt-[3px]">
                                                    must try
                                                  </p>
                                                </div>
                                              )}
                                              {comment?.rated == "liked" && (
                                                <div className="w-fit h-fit mt-[.5rem] flex flex-col items-center ">
                                                  <img
                                                    src={good}
                                                    alt="musttry"
                                                    className="w-[20px] aspect-square"
                                                  />
                                                  <p className="font-inter font-[400] mt-[3px]">
                                                    Liked
                                                  </p>
                                                </div>
                                              )}
                                              {comment?.rated == "notLiked" && (
                                                <div className="w-fit h-fit mt-[.5rem] flex flex-col items-center ">
                                                  <img
                                                    src={notliked}
                                                    alt="musttry"
                                                    className="w-[20px] aspect-square"
                                                  />
                                                  <p className="font-inter font-[400] mt-[3px]">
                                                    Not liked
                                                  </p>
                                                </div>
                                              )}
                                              {comment?.rated == "" && (
                                                <div className="w-fit h-fit mt-[.5rem] flex flex-col items-center ">
                                                  <img
                                                    src={notliked}
                                                    alt="musttry"
                                                    className="w-[20px] aspect-square"
                                                  />
                                                  <p className="font-inter font-[400] mt-[3px]">
                                                    No Reaction
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              )
              :
              (
                <div className="w-full h-[100vh] flex flex-col items-center justify-center">
                  <img src={noproductfound} alt='no data found' />
                  <p className=" font-inter font-[600] text-[1.4rem] capitalize text-center">No data found just Refresh the page</p>
                </div>
              )
          )
      }
    </>
  );
};

export default MerchantProfile;
