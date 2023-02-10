import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'
import { useCssHandles } from 'vtex.css-handles'

import './styles.css'

const QuickOrder = () => {

    //Handles para css

    const CSS_HANDLES = [
        "quickOrder__container",
        "quickOrder__main--title",
        /* "quickOrder__formulario", */
        "quickOrder__form--main-container",
        "quickOrder__container--label",
        /*   "quickOrder__label", */
        "quickOrder__input",
        /* "quickOrder__container--inputAndBtn", */
        "quickOrder__btn-submit",
    ]

    const handles = useCssHandles(CSS_HANDLES)

    const [inputText, setInputText] = useState("");
    const [search, setSearch] = useState("")


    const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
    const [addToCart] = useMutation(UPDATE_CART)

    const handleChange = (evt: any) => {
        setInputText(evt.target.value);
        console.log("Input changed", inputText)
    }

    useEffect(() => {
        console.log("el resultado producto es", product, search);
        if (product) {
            let skuId = parseInt(inputText)
            addToCart({
                variables: {
                    salesChannel: "1",
                    items: [
                        {
                            id: skuId,
                            quantity: 1,
                            seller: "1"
                        }
                    ]
                }
            })
                .then(() => {
                    window.location.href = "/checkout"
                })
        }
    }, [product, search])

    const addProductToCart = () => {
        getProductData({
            variables: {
                sku: inputText
            }
        })
    }

    const searchProduct = (evt: any) => {
        evt.preventDefault();
        if (!inputText) {
            alert("Ingresa algo")
        } else {
            console.log("Estamos buscando", inputText)
            setSearch(inputText)
            addProductToCart()
            //Buscaremos data del producto
        }
    }

    return <div className={handles["quickOrder__container"]}>
        <h2 className={handles["quickOrder__main--title"]}>Compra rápida en COMPRAGAMER</h2>
        <form onSubmit={searchProduct}>
            <div className={handles["quickOrder__form--main-container"]}>
                <label className={handles["quickOrder__container--label"]} htmlFor='sku'>Ingresa el número de SKU</label>
                <input id='sku' type='text' onChange={handleChange}></input>
            </div>
            <input className={handles["quickOrder__btn-submit"]} type="submit" value="SUMAR AL CARRITO" />
        </form>
    </div>
}

export default QuickOrder