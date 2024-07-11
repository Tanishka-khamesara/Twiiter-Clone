import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import {useQuery} from "@tanstack/react-query"
import { useEffect } from "react";

const Posts = ({feedType,username,userId}) => {

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "https://twiiter-clone-3sne.onrender.com/api/posts/all";
			case "following":
				return "https://twiiter-clone-3sne.onrender.com/api/posts/following";
			case "posts":
				return `https://twiiter-clone-3sne.onrender.com/api/posts/user/${username}`;
			case "likes":
				return `https://twiiter-clone-3sne.onrender.com/api/posts/likes/${userId}`;
			default:
				return "https://twiiter-clone-3sne.onrender.com/api/posts/all";
		}
	};
	const POST_ENDPOINT = getPostEndpoint();


	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					},
					
					credentials: 'include',
				});
				const data = await res.json();
				// console.log("__->     ", data)


				if (!res.ok) {
					throw new Error(data.error || "Something went Wrong");
				}

				return data
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch,username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;