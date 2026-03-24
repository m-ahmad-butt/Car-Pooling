const PostRide = ({ showPostModal, setShowPostModal, postForm, handlePostFormChange, handlePostRide, postErrors, setPostErrors }) => {
    if (!showPostModal) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="px-6 py-6 border-b border-gray-50 flex items-center gap-6">
                <button onClick={() => setShowPostModal(false)} className="text-black hover:bg-gray-50 p-1 rounded-lg transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-2xl font-black tracking-tight">Create New Ride</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50/20">
                <div className="max-w-6xl mx-auto">
                    <form onSubmit={handlePostRide} className="space-y-8">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                            {/* Left: Profile + Form */}
                            <div className="w-full lg:w-2/3 space-y-8">
                                {/* Form Fields Section */}
                                <div className="space-y-4 bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                                            <span className="text-[10px] text-gray-300 font-bold">{postForm.title.length}/20</span>
                                        </div>
                                        <input type="text" placeholder="e.g. Ride to Allama Iqbal Airport" value={postForm.title} onChange={(e) => handlePostFormChange('title', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none" required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Category (Vehicle)</label>
                                            <select 
                                                value={postForm.vehicleType} 
                                                onChange={(e) => {
                                                    handlePostFormChange('vehicleType', e.target.value);
                                                    setPostErrors(prev => ({ ...prev, vehicleType: '' }));
                                                }} 
                                                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none appearance-none ${postErrors.vehicleType ? 'border-red-500' : 'border-transparent'}`}
                                            >
                                                <option value="">Select a category</option>
                                                <option>CAR</option>
                                                <option>BIKE</option>
                                            </select>
                                            {postErrors.vehicleType && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1">{postErrors.vehicleType}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Campus</label>
                                            <input 
                                                type="text" 
                                                value={postForm.campus} 
                                                readOnly 
                                                className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-500 cursor-not-allowed outline-none" 
                                            />
                                            <p className="text-[9px] font-bold text-gray-300 uppercase mt-2 ml-1 italic">You can change campus from profile</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Vehicle Number</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. LEC-1234" 
                                                value={postForm.vehicleNumber} 
                                                onChange={(e) => {
                                                    handlePostFormChange('vehicleNumber', e.target.value);
                                                    setPostErrors(prev => ({ ...prev, vehicleNumber: '' }));
                                                }} 
                                                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none ${postErrors.vehicleNumber ? 'border-red-500' : 'border-transparent'}`} 
                                                required 
                                            />
                                            {postErrors.vehicleNumber && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1">{postErrors.vehicleNumber}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Available Seats</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="10" 
                                                placeholder="e.g. 3" 
                                                value={postForm.seats} 
                                                onChange={(e) => {
                                                    handlePostFormChange('seats', e.target.value);
                                                    setPostErrors(prev => ({ ...prev, seats: '' }));
                                                }} 
                                                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none ${postErrors.seats ? 'border-red-500' : 'border-transparent'}`} 
                                                required 
                                            />
                                            {postErrors.seats && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1">{postErrors.seats}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Departure Date</label>
                                            <input 
                                                type="date" 
                                                value={postForm.date} 
                                                onChange={(e) => {
                                                    handlePostFormChange('date', e.target.value);
                                                    setPostErrors(prev => ({ ...prev, dateTime: '' }));
                                                }} 
                                                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none ${postErrors.dateTime ? 'border-red-500' : 'border-transparent'}`} 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Departure Time</label>
                                            <input 
                                                type="time" 
                                                value={postForm.departureTime} 
                                                onChange={(e) => {
                                                    handlePostFormChange('departureTime', e.target.value);
                                                    setPostErrors(prev => ({ ...prev, dateTime: '' }));
                                                }} 
                                                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none ${postErrors.dateTime ? 'border-red-500' : 'border-transparent'}`} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    {postErrors.dateTime && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{postErrors.dateTime}</p>}


                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Pick up</label>
                                            <span className="text-[10px] text-gray-300 font-bold">{postForm.location.length}/20</span>
                                        </div>
                                        <input type="text" placeholder="Where is the pick-up point?" value={postForm.location} onChange={(e) => handlePostFormChange('location', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none" required />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Destination</label>
                                            <span className="text-[10px] text-gray-300 font-bold">{postForm.destination.length}/20</span>
                                        </div>
                                        <input type="text" placeholder="Where is the drop-off point?" value={postForm.destination} onChange={(e) => handlePostFormChange('destination', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none" required />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                                            <span className="text-[10px] text-gray-300 font-bold">{postForm.description.length}/200</span>
                                        </div>
                                        <textarea rows="4" placeholder="Describe your ride rules, timing, etc..." value={postForm.description} onChange={(e) => handlePostFormChange('description', e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-1 focus:ring-black/5 transition-all outline-none resize-none" required></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Image Upload */}
                            <div className="w-full lg:w-1/3 bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm sticky top-0">
                                <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 tracking-widest">Item Image (JPEG, PNG, or WEBP, max 1MB)</label>
                                <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-gray-50/30 group hover:border-black/10 transition-all cursor-pointer h-full min-h-[400px]">
                                    <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-sm border border-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-sm font-black text-gray-700 mb-2 text-center">Drag and drop an image or click to browse</p>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase letter tracking-widest">MAX 1MB</p>

                                </div>
                                <div className="max-w-2xl mx-auto pt-6">
                                    <button type="submit" className="w-full bg-black text-white py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-black/20 active:scale-95 transition-all">
                                        Publish Ride
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostRide;
