import prisma from '../repository/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { CharitySector as GQLCharitySector, QueryBeneficiaryArgs } from '../generated/graphql'; 

export interface ICharityDetail {
    name: string;
    description: string;
    mission?: string;
    sector: GQLCharitySector;
    address?: string;
    website?: string;
    charityAdminId?: string;
}

const charityService = {
    getCharities: (args: Prisma.CharityFindManyArgs) => {
        return prisma.charity.findMany(args);
    },

    getCharityById: (charityId: string, args?: Prisma.CharityFindUniqueArgs) => {
        return prisma.charity.findUnique({ where: { id: charityId }, ...args });
    },

    createCharity: async (detail: ICharityDetail) => {
        return prisma.charity.create({
            data: {
                name: detail.name,
                description: detail.description,
                mission: detail.mission,
                sector: detail.sector, 
                address: detail.address,
                website: detail.website,
                charityAdminId: detail.charityAdminId,
            },
        });
    },

    createBeneficiary: async(
        { charityId, detail: { first_name, last_name, email, password } }: { charityId: number, detail: { first_name: string, last_name: string, email?: string, password?: string } }) => {
        return prisma.users.create({
            data: {
                email, 
                password: await hashPassword(password), 
                first_name, last_name,
                agree_to_terms: true,
                role: 'recipient',
                status: 'active',
                charity_recipient: {
                    connect: {
                        id: charityId
                    }
                }
            }
        })
    },

    getBeneficiaries: async (charityId: string, args: { skip?: number, take?: number }) => {
        return prisma.beneficiary.findMany({
            where: { charityId: charityId },
            skip: args.skip,
            take: args.take,
        });
    },

    createBeneficiary: async (charityId: string, detail: any) => {
        return prisma.beneficiary.create({
            data: {
                ...detail,
                charity: {
                    connect: { id: charityId }
                }
            }
        });
    },
};

export default charityService;

