import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { categoryAdd, messageClear, get_category,updateCategory,deleteCategory } from '../../store/Reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';

const Category = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, categorys } = useSelector((state) => state.category);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState('');
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)
 

  const [state, setState] = useState({
    name: '',
    image: '',
  });

  const imageHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState({
        ...state,
        image: files[0],
      });
    }
  };

  const addOrUpdateCategory= (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updateCategory({ id:editId, ...state }))
    }
    else{
      dispatch(categoryAdd(state))
    }
  
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: '',
        image: '',
      });
      setImage('');
      setIsEdit(false)
      setEditId(null)

    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_category(obj));
  }, [searchValue, parPage, currentPage, dispatch]);

   /// Handle Edit Button 
   const handleEdit = (category) => {
    setState({
        name: category.name,
        image: category.image
    })
    setImage(category.image)
    setEditId(category._id)
    setIsEdit(true)
    setShow(true)
    }

    const handleDelete = (id) => {
      if (window.confirm('Are you sure to delete category?')) {
          console.log("delete category id",id);
          dispatch(deleteCategory(id));
      }
  }


  return (
    <div className='px-2 lg:px-7 pt-5'>
      {/* Mobile Add Button */}
      <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-gradient-to-r from-[#000033] to-[#0077cc] rounded-md shadow-lg'>
        <h1 className='text-[#ffffff] font-semibold text-lg'>Category</h1>
        <button
          onClick={() => setShow(true)}
          className='bg-[#ffffff] shadow-lg hover:shadow-[#ffffff]/40 px-4 py-2 cursor-pointer text-[#000033] rounded-sm text-sm'
        >
          Add
        </button>
      </div>

      <div className='flex flex-wrap w-full'>
        {/* Category List Section */}
        <div className='w-full lg:w-7/12'>
          <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
            <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

            <div className='relative overflow-x-auto'>
              <table className='w-full text-sm text-left text-[#000000]'>
                <thead className='text-sm text-[#000000] uppercase border-b border-[#0077cc]'>
                  <tr>
                    <th scope='col' className='py-3 px-4'>No</th>
                    <th scope='col' className='py-3 px-4'>Image</th>
                    <th scope='col' className='py-3 px-4'>Name</th>
                    <th scope='col' className='py-3 px-4'>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {categorys.map((d, i) => (
                    <tr key={i} className='hover:bg-[#f8f9fa] transition-all duration-200'>
                      <td className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                      <td className='py-1 px-4 font-medium whitespace-nowrap'>
                        <img className='w-[45px] h-[45px] rounded-md' src={d.image} alt='' />
                      </td>
                      <td className='py-1 px-4 font-medium whitespace-nowrap'>{d.name}</td>
                      <td className='py-1 px-4 font-medium whitespace-nowrap'>
                        <div className='flex justify-start items-center gap-4'>
                        <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50' onClick={() => handleEdit(d)} > <FaEdit/> </Link> 
                        <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50' onClick={() => handleDelete(d._id)}   > <FaTrash/> </Link> 
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='w-full flex justify-end mt-4'>
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={50}
                parPage={parPage}
                showItem={3}
              />
            </div>
          </div>
        </div>

        {/* Add Category Form */}
        <div
          className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${
            show ? 'right-0' : '-right-[340px]'
          } z-[9999] top-0 transition-all duration-500`}
        >
          <div className='w-full pl-5'>
            <div className='bg-[#ffffff] h-screen lg:h-auto px-3 py-2 lg:rounded-md shadow-lg'>
              <div className='flex justify-between items-center mb-4'>
                <h1 className='text-[#000000] font-semibold text-xl mb-4 w-full text-center'>{ isEdit ? 'Edit Category' : 'Add Category' }</h1>
                <div onClick={() => setShow(false)} className='block lg:hidden'>
                  <IoMdCloseCircle className='text-[#000000] text-2xl' />
                </div>
              </div>

              <form onSubmit={addOrUpdateCategory}>
                <div className='flex flex-col w-full gap-1 mb-3'>
                  <label htmlFor='name' className='text-[#000000]'>
                    Category Name
                  </label>
                  <input
                    value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                    className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
                    type='text'
                    id='name'
                    name='category_name'
                    placeholder='Category Name'
                  />
                </div>

                <div>
                  <label
                    className='flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-[#0077cc] w-full border-[#0077cc]'
                    htmlFor='image'
                  >
                    {imageShow ? (
                      <img className='w-full h-full rounded-md' src={imageShow} alt='' />
                    ) : (
                      <>
                        <span>
                          <FaImage className='text-[#0077cc] text-4xl' />
                        </span>
                        <span className='text-[#0077cc]'>Select Image</span>
                      </>
                    )}
                  </label>
                  <input onChange={imageHandle} className='hidden' type='file' name='image' id='image' />
                </div>

                <div className='mt-4'>
                  <button
                    disabled={loader}
                    className='bg-[#0077cc] w-full hover:shadow-[#0077cc]/50 hover:shadow-lg text-[#ffffff] rounded-md px-7 py-2 mb-3'
                  >
                  {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : isEdit ? 'Update Category' : 'Add Category'}
                 </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;