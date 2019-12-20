#include "vntlib.h"




// ************* 监管数据定义 begin ************* //



struct{

  string from;   // 发起者

  string to;   // 接受者

  string value;   // 价钱

}transaction;



// ************* 监管数据定义 end ************* //




// 初始化
constructor BizContract()
{

}


// ************* 业务方法 begin ************* //



// ************* 业务: 交易, 描述: It is for fun


MUTABLE
void Pub(){

}

MUTABLE
void trans(){

	// implement me!
	Report(transaction data);

}




// ************* 业务方法 end ************* //