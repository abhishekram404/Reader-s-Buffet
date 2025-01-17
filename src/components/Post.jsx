import React from "react";
import Image from "react-bootstrap/Image";
import "../styles/Post.css";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

export default function Post({post}) {


  console.log(post.category);
  return (
    <>
      <div className="post">
        {post.photo && (
        <div className="postImg">
          <Image src={process.env.REACT_APP_BASE_API + post.photo} alt="Cover" fluid />
        </div>
        )}

        <div className="postInfo">
          <div className="postCats">
           
            <span className="postCat">{post?.category?.map((c) => (
              <p>{c.name}</p>
              
            ))}</span>
            
          </div>
          <Link className="link" to={`${post._id}`}>
          <span className="postTitle">{post.title}</span>
          </Link>
       
          <span className="postDate">{new Date(post.createdAt).toDateString()}</span>
        </div>
        <p className="postDesc">
          {post.description}
        </p>
      </div>
    </>
  );
}
