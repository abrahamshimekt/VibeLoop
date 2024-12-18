import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import VibeLoop from "../utils/vibe-loop.jpg"
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { createOrGetUser } from "@/utils";
import useAuthStore from "@/store/authStore";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/router";

function Navbar() {
  const { userProfile, addUser, removeUser } = useAuthStore();
  const [searchValue,setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = (e:FormEvent) => {
    e.preventDefault();
    if(searchValue){
      router.push(`/search/${searchValue}`);

    }

    

  };
  return (
    <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
      <Link href="/">
        <div className="w-[100px] md:w-[130px] md:h-[30px] h-[38px]">
          <Image
            className="cursor-pointer"
            src={VibeLoop}
            alt="Tik Tik"
            layout="responsive"
          />
        </div>
      </Link>
      <div className="relative hidden md:block">
        <form
          onSubmit={handleSearch}
          className="absolute md:static top-10 left-20 bg-white"
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Accounts and Videos"
            className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2
          focus:border-gray-300
          w-[300px]
          md:w-[350px]
          rounded-full
          md:top-0"
          />
          <button
          className="absolute md:righ-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400"
          onClick={handleSearch}>
            <BiSearch/>
          </button>
        </form>
      </div>
      <div>
        {userProfile ? (
          <div className="flex gap-5 md:gap-10">
            <Link href="/upload">
              <button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center">
                <IoMdAdd className="text-xl" />
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>
            {userProfile?.image && (
              <Link href={`/profile/${userProfile._id}`}>
                <Image
                  width={40}
                  height={40}
                  className="rounded-full"
                  src={userProfile?.image}
                  alt="Profile Photo"
                />
              </Link>
            )}
            <button type="button" className="px-2">
              <AiOutlineLogout
                onClick={() => {
                  googleLogout();
                  removeUser();
                }}
                color="red"
                fontSize={21}
              />
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => {
              createOrGetUser(response, addUser);
            }}
            onError={() => {}}
          />
        )}
      </div>
    </div>
  );
}

export default Navbar;
