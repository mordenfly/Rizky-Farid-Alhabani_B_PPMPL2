// test/service.test.js
const sinon = require('sinon');
const { expect } = require('chai');
const {describe, beforeEach, it } = require('mocha')
const Service = require('../src/service');
const PrimaryRepository = require('../src/repository');
const SecondaryRepository = require('../src/secondaryRepository');
const Repository = require('../src/repository')

describe('Service Integration Tests with Multiple Stubs', () => {
    let service;
    let primaryRepositoryStub;
    let secondaryRepositoryStub;
    let repositoryStub;

    beforeEach(() => {
        // Membuat stub untuk kedua repositori
        primaryRepositoryStub = sinon.createStubInstance(PrimaryRepository);
        secondaryRepositoryStub = sinon.createStubInstance(SecondaryRepository);
        repositoryStub = sinon.createStubInstance(Repository);
        
        // Inisialisasi instance Service
        service = new Service();
        
        // Menyuntikkan stub repositori ke dalam service
        service.primaryRepository = primaryRepositoryStub;
        service.secondaryRepository = secondaryRepositoryStub;
        service.repository = repositoryStub;
    });

    it('should return item from primary repository if found', () => {
        // Arrange
        const item = { id: 1, name: 'Item 1' };
        primaryRepositoryStub.getItemById.withArgs(1).returns(item);
        
        // Act
        const result = service.getItemById(1);
        
        // Assert
        expect(result).to.equal(item);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.notCalled).to.be.true;
    });

    it('should return item from secondary repository if not found in primary', () => {
        // Arrange
        primaryRepositoryStub.getItemById.withArgs(3).returns(null);
        const item = { id: 3, name: 'Item 3' };
        secondaryRepositoryStub.getItemById.withArgs(3).returns(item);
        
        // Act
        const result = service.getItemById(3);
        
        // Assert
        expect(result).to.equal(item);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
    });

    it('should throw an error if item is not found in both repositories', () => {
        // Arrange
        primaryRepositoryStub.getItemById.withArgs(5).returns(null);
        secondaryRepositoryStub.getItemById.withArgs(5).returns(null);
        
        // Act & Assert
        expect(() => service.getItemById(5)).to.throw('Item not found in both repositories');
        expect(primaryRepositoryStub.getItemById.calledOnceWith(5)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.calledOnceWith(5)).to.be.true;
    });

    // Pengujian untuk deleteItem
    it('should delete item from primary repository if it exists', () => {
        // Arrange
        primaryRepositoryStub.deleteItemById.withArgs(1).returns(true);
        
        // Act
        const result = service.deleteItem(1);
        
        // Assert
        expect(result).to.be.true;
        expect(primaryRepositoryStub.deleteItemById.calledOnceWith(1)).to.be.true;
        expect(secondaryRepositoryStub.deleteItemById.notCalled).to.be.true;
    });

    it('should delete item from secondary repository if not found in primary', () => {
        // Arrange
        primaryRepositoryStub.deleteItemById.withArgs(3).returns(false);
        secondaryRepositoryStub.deleteItemById.withArgs(3).returns(true);
        
        // Act
        const result = service.deleteItem(3);
        
        // Assert
        expect(result).to.be.true;
        expect(primaryRepositoryStub.deleteItemById.calledOnceWith(3)).to.be.true;
        expect(secondaryRepositoryStub.deleteItemById.calledOnceWith(3)).to.be.true;
    });

    it('should throw an error if item to delete is not found in both repositories', () => {
        // Arrange
        primaryRepositoryStub.deleteItemById.withArgs(5).returns(false);
        secondaryRepositoryStub.deleteItemById.withArgs(5).returns(false);
        
        // Act & Assert
        expect(() => service.deleteItem(5)).to.throw('Item not found in both repositories');
        expect(primaryRepositoryStub.deleteItemById.calledOnceWith(5)).to.be.true;
        expect(secondaryRepositoryStub.deleteItemById.calledOnceWith(5)).to.be.true;
    });
    
describe('Service Integration Tests', () => {
    let service;
    let repositoryStub;
    let primaryRepositoryStub;
    let secondaryRepositoryStub;

    beforeEach(() => {
        // Membuat stub untuk kedua repositori
        primaryRepositoryStub = sinon.createStubInstance(PrimaryRepository);
        secondaryRepositoryStub = sinon.createStubInstance(SecondaryRepository);
        repositoryStub = sinon.createStubInstance(Repository);
        
        // Inisialisasi instance Service
        service = new Service();
        
        // Menyuntikkan stub repositori ke dalam service
        service.primaryRepository = primaryRepositoryStub;
        service.secondaryRepository = secondaryRepositoryStub;
        service.repository = repositoryStub;
    });

    it('should return all items', () => {
        const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
        repositoryStub.getAllItems.returns(items);

        const result = service.getAllItems();

        expect(result).to.equal(items);
        expect(repositoryStub.getAllItems.calledOnce).to.be.true;
    });

    it('should return an item by id', () => {
        const item = { id: 1, name: 'Item 1' };
        primaryRepositoryStub.getItemById.withArgs(1).returns(item);

        const result = service.getItemById(1);

        expect(result).to.deep.equal(item);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
    });

    it('should throw an error when item is not found', () => {
        primaryRepositoryStub.getItemById.withArgs(3).returns(null);
        secondaryRepositoryStub.getItemById.withArgs(3).returns(null);

        expect(() => service.getItemById(3)).to.throw('Item not found');
        expect(primaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
    });

    it('should add a new item', () => {
        repositoryStub.getAllItems.returns([{id: 1, name:'Item 1'}, {id: 2, name: 'Item 2'}]);
        const newItem = { id: 3, name: 'Item 3' };
        repositoryStub.addItem.returns(newItem);

        const result = service.addItem('Item 3');

        expect(result).to.equal(newItem);
        expect(repositoryStub.addItem.calledOnceWith(newItem)).to.be.true;
    });
});
});

