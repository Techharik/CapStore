// base = Products.find()
//bigQ = query params.



class WhereClause{
    constructor(base,bigQ){
        this.base  = base
        this.bigQ = bigQ
    }

    search(){
        const searchWord = this.bigQ.search ? {
         name:{
            $regex:this.bigQ.search,
            $options:'i'
         }

        }:{}
        this.base = this.base.find({...searchWord})
        return this
    }

    filter(){
        const copyQ = {...this.bigQ}

        delete copyQ['search']
        delete copyQ['limit']
        delete copyQ['page']

        let stringCopyQ = JSON.stringify(copyQ)
        stringCopyQ= stringCopyQ.replace(
            /\b(gte|lte|gt|lt)\b/g,
            (m) => `$${m}`
        )
    const jsonCopyQ = JSON.parse(stringCopyQ)

        this.base = this.base.find({...jsonCopyQ})
        return this
    }

    pager(resultperPage) {
        let currentPage = 1;
        if (this.bigQ.page) {
          currentPage = this.bigQ.page;
        }
    
        const skipVal = resultperPage * (currentPage - 1);
    
        this.base = this.base.limit(resultperPage).skip(skipVal);
        return this;
      }



}

export default WhereClause;