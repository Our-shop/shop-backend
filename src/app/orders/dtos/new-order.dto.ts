import {ApiProperty} from '@nestjs/swagger';
import {ProductDto} from '../../../shared/dto/product.dto';
import {ValidateNested} from 'class-validator';

export class NewOrderDto {
    @ApiProperty({
        description: 'Delivery id',
    })
    deliveryId!: string;

    @ApiProperty({
        description: 'User id',
    })
    userId!: string;

    // @ApiProperty({
    //     description: 'Array of products',
    // })
    // products!: ProductDto[];

    @ApiProperty({
        description: "List of products",
        required: false,
        isArray: true,
        type: () => ProductDto
    })
    @ValidateNested({ context: ProductDto })
    products?: ProductDto[];

    // @ApiProperty({
    //     description: 'Total order amount',
    // })
    // totalAmount!: number;
}
