import React, { useState, useRef } from "react";
import "./Imagegenerator.css";
import default_image from "../Assets/default_image.svg";

const Imagegenerator = () => {
  const [image_url, setImage_url] = useState("/");
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      return 0;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer #your secret API key",
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          const errorResponse = await response.json();
          console.error("400 Bad Request. OpenAI API error:", errorResponse);
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();

      if (data.data && data.data.length > 0 && data.data[0].url) {
        setImage_url(data.data[0].url);
      } else {
        console.error("Invalid response format from OpenAI API:", data);
      }
    } catch (error) {
      console.error("Error during API request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">Ai Image Generator</div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === "/" ? default_image : image_url} alt="" />
        </div>
        <div className="loading">
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>
            Loading...
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
        ></input>
        <div
          className="generate-btn"
          onClick={() => {
            imageGenerator();
          }}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default Imagegenerator;
