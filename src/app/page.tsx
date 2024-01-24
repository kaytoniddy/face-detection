'use client'

import { useRef, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = './models';

export default function Home() {

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const imgElementRef = useRef<HTMLImageElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [noOfFaces, setNoOfFaces] = useState<faceapi.FaceDetection[]>([]);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (_: any) => {
    hiddenFileInput.current?.click();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = async (event: any) => {
    const fileUploaded = event.target.files[0];
    const imgElement = imgElementRef.current;
    if (imgElement) {
      imgElement.src = URL.createObjectURL(fileUploaded);
    }
  };
  
  const detectFace = async () => {
    if (!imgElementRef.current || isDetecting) return;
    setIsDetecting(true);
    /** load the model from public or url. right now it is using the model from <root-dir>/public/models/xxx */
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    // validate the uploaded image here
    /** detectAllFaces requires a HTMLImageElement */
    const res = await faceapi.detectAllFaces(imgElementRef.current!);
    setIsDetecting(false);
    setNoOfFaces(res);

  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex gap-2">
        <div style={{width: 600, height: 600}} className='border-2'>
          <img ref={imgElementRef} className='w-full' />
        </div>
        <div className="flex flex-col">
          <div className="flex gap-4">
            <div>
              <button onClick={handleClick} className="p-2 rounded bg-blue-400 text-white">upload</button>
              <input
                type="file"
                onChange={handleChange}
                ref={hiddenFileInput}
                style={{ display: 'none' }} // Make the file input element invisible
              />
            </div>
            <div>
              <button disabled={isDetecting} onClick={detectFace} className="p-2 rounded bg-blue-400 text-white">{isDetecting ? "loading...": "detect face"}</button>
            </div>
          </div>
          <div>
            <p>no of faces: {noOfFaces.length}</p>
            {
              noOfFaces.map((face, index) => {
                return (
                  <div key={index}>
                    <p>face {index + 1}</p>
                    <p>confidence: {face.score}</p>
                    {/* <p>box: {face.detection._box.x}, {face.detection._box.y}, {face.detection._box.width}, {face.detection._box.height}</p> */}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </main>
  )
}
