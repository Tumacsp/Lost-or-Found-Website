import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import MapComponent from "../../components/map_api";

const ReportPage = () => {
    const [file, setFile] = useState();
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [details, setDetails] = useState('');
    const imageInfo = {fileName:"", path:""}
    const [location, setLocation] = useState({ lat: 13.764953, lon: 100.538316 });
  
    function handleImageChange(e) {
        // console.log(e.target.files);
        try {
          imageInfo.fileName = e.target.files[0].name
          imageInfo.path = e
          console.log(imageInfo);
          setFile(URL.createObjectURL(e.target.files[0]));
        } catch (error) {
          console.log(error)
        }
    }
    function handleTitleChange(e){
      // console.log(e.target.value)
      setTitle(e.target.value)
    }
    const handleTypeChange = e => {
      // console.log(e.target.value)
      setType(e.target.value)
    }
    function handleDetailsChange(e){
      // console.log(e.target.value)
      setDetails(e.target.value)
    }
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex-grow">
        <div className='grid xl:grid-cols-3 gap-4'>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 xl:col-span-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">Report Your Lost</h2>
            <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto"> 
              Easily report lost items or find something you've misplaced. Start by exploring the options below.
            </p>

            <h2>Type of Post</h2>
            <div className="flex items-center mb-4">
                <input id="default-radio-1" type="radio" value="objects" name="postType" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                checked={type === 'objects'} onChange={handleTypeChange}></input>
                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium">Dead or Alive: Missing Objects</label>
            </div>
            <div className="flex items-center">
                <input id="default-radio-2" type="radio" value="living" name="postType" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                checked={type === 'living'} onChange={handleTypeChange}></input>
                <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium">Alive: Missing Living things</label>
            </div>

            <h2>Post Title:</h2>
            <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' 
            type='text' onChange={handleTitleChange} placeholder='Title'></input>
            

            <h2>Add Image:</h2>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            
            <h2 className="text-lg font-semibold mt-6">📌 Location:</h2>
              <div className="mb-6 space-y-3">
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
                  <MapComponent onLocationChange={setLocation} />
                </div>
                <p className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                  ✅ Selected location:{" "}
                  <span className="font-medium">
                    {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                  </span>
                </p>
              </div>

            <h2>Post Details:</h2>
            <textarea className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
            placeholder='Details' id="message" rows="6" onChange={handleDetailsChange}></textarea>
          </div>

          <div className='mt-5'>
            <h1 className="text-center">(Post Preview)</h1>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-center mt-4">Wanted</h1>
              <DisplayType type={type}/>
              <hr className="h-0.5 border-t-0 bg-neutral-500" />
              <h1 className="text-md sm:text-xl lg:text-2xl text-center mb-4">{title}</h1>
              <div className='flex items-center justify-center'>
                <img className='max-w-40' src={file} />
              </div>
              <p>{details}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function DisplayType(type){
  if (type.type === 'living') {
    return (
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-center mb-4"><s>Dead</s> or Alive</h1>
      </div>
    )
  }else if(type.type === 'objects'){
    return (
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-center mb-4">Dead or Alive</h1>
      </div>
    )
  }
}
export default ReportPage;
