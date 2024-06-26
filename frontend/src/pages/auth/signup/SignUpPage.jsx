import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import XSvg from "../../../components/svgs/X";

import toast  from "react-hot-toast";
import axios from "axios";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullname: "",
		password: "",
    });
    const apiUrl = import.meta.env.VITE_BACKEND_RENDER;

    const queryClient = useQueryClient();

	const { mutate, isError, isLoading, error } = useMutation({
		mutationFn: async ({ email, username, password, fullname }) => {
			try {
				// const res = await fetch("http://localhost:8000/api/auth/signup", {
				// 	method: "POST",
				// 	headers: {
				// 		"content-type": "application/json",
				// 	},
				// 	body: JSON.stringify({ email, username, fullname, password }),
				// });
				const res = await axios.post(`http://localhost:10000/api/auth/signup`, {
					email,username,password,fullname
				}, {
					headers: {
						"content-type": "application/json",
                    },
                    withCredentials: true,
				})

				// if (!res.ok) throw new Error(res.message);

				const data = await res.data;
				
				if (data.error) throw new Error(data.error);
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				// toast.error(error.message);
				throw error;
			}
		},
		onSuccess: () => {
            toast.success("Account Created Succesfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
	};

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Full Name'
                                name='fullname'
                                onChange={handleInputChange}
                                value={formData.fullname}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>
                        {isLoading ? "Loading..." : "Sign up"}
                    </button>
                    {isError && <p className='text-red-500'>{"Something Went Wrong"}</p>}
                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
