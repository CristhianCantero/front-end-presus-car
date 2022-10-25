import React from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import '../components/Loading.css';

export default function Loading() {
    return (
        <div className='divHijo'>
            <ThreeCircles
                height="100"
                width="100"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="three-circles-rotating"
                outerCircleColor=""
                innerCircleColor=""
                middleCircleColor=""
            />
        </div>
    )
}