import {BasicDto} from '../../../shared/dto/basic.dto';
import {ApiProperty} from '@nestjs/swagger';
import {ProductDto} from '../../products/dtos/product.dto';
import {UserDto} from '../../users/dtos/user.dto';
import {ValidateNested} from 'class-validator';

export class NewOrderDto extends BasicDto {
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