import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input;

function SearchFeature(props) {

    const [SearchTerms, setSearchTerms] = useState("")

    const onChangeSearch = (event) => {
        setSearchTerms(event.currentTarget.value)
    }

    const onSubmit = () => {
        props.refreshFunction(SearchTerms)
        setSearchTerms("")
    }

    return (
        <div>
            <Search
                value={SearchTerms}
                onChange={onChangeSearch}
                onSearch={onSubmit}
                enterButton="Search"
                placeholder="Search By Typing..."
            />
        </div>
    )
}

export default SearchFeature
