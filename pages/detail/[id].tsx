import { Video } from "@/types";
import { BASE_URL } from "@/utils";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import useAuthStore from "@/store/authStore";
import LikeButton from "@/components/LikeButton";
import Comments from "@/components/Comments";
interface IProps {
  postDetails: Video;
}
const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const vidoeRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const onVideoClick = () => {
    if (playing) {
      vidoeRef?.current?.pause();
      setPlaying(false);
    } else {
      vidoeRef?.current?.play();
      setPlaying(true);
    }
  };
  useEffect(() => {
    if (post && vidoeRef?.current) {
      vidoeRef.current.muted = isVideoMuted;
    }
  }, [post, isVideoMuted]);
  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });
      setPost({ ...post, likes: data.likes });
    }
  };
  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    if (userProfile && comment) {
      setIsPostingComment(true);
      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment,
      });
      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };
  if (!post) return null;
  return (
    <div className="flex w-full absolute left-0 top-o bg-white flex-wrap lg:flex-nowrap">
      <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black bg-no-repeat bg-cover bg-center">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p
            className="cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <MdOutlineCancel className="text-white text-[35px]" />
          </p>
        </div>
        <div className="relative">
          <div className="lg:h-[100hv] h-[60vh]">
            <video
              ref={vidoeRef}
              loop
              src={post?.video?.asset?.url}
              onClick={onVideoClick}
              className="h-full cursor-pointer"
            ></video>
          </div>
          <div className="absolute top-[45%] left-[45%] cursor-pointer">
            {!playing && (
              <button onClick={onVideoClick}>
                <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
          {isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(false)}>
              <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
            </button>
          ) : (
            <button onClick={() => setIsVideoMuted(true)}>
              <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
            </button>
          )}
        </div>
      </div>
      <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-10">
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className="ml-4 md:w-20  md:h-20 w-16 h-16">
              <Link href="/">
                <>
                  <Image
                    width={62}
                    height={62}
                    className="rounded-full"
                    src={post.postedBy.image}
                    alt="Profile Photo"
                    layout="responsive"
                  />
                </>
              </Link>
            </div>
            <div>
              <Link href="/">
                <div className=" mt-3 flex flex-col gap-2">
                  <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                    {post.postedBy.username}{" "}
                    <GoVerified className="text-blue-400 text-md" />
                  </p>
                  <p className="capitalize font-medium text-xs text-gray-500 md:block ">
                    {post.postedBy.username}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <p className="px-10 tex-lg text-gray-600">{post?.caption}</p>
          <div className="mt-10 px-10">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDisLike={() => handleLike(false)}
              />
            )}
          </div>
          <Comments
            comment={comment}
            setComment={setComment}
            addComment={addComment}
            comments={post.comments}
            isPostingComment={isPostingComment}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);
    return {
      props: { postDetails: data },
    };
  } catch (error) {
    return { props: { postDetails: null } };
  }
};

export default Detail;
