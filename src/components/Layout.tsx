import React, { ReactElement } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface Props {
    children: ReactElement;
}

export default function Layout({children}: Props) {
    return (
        <>
            <Header />
            <div className="content">
                <Sidebar />
                {children}
            </div>
        </>
    );
}