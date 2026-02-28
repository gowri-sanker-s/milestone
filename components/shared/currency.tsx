import React from 'react'

type currencyType = {
    height: string
    width: string
}
const currency = ({ height, width }: currencyType) => {
    return (
        <div className={`h-[${height}] w-[${width}]`}>
            <img src="" alt="" />
        </div>
    )
}

export default currency