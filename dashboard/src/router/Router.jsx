// import React from 'react';
import { useRoutes } from 'react-router-dom';

const Router = ({allRoutes}) => {
    const routes= useRoutes([...allRoutes])
    // console.log("All Routes in Router:", allRoutes);

    return routes;
};

export default Router;