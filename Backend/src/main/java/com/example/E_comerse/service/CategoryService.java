package com.example.E_comerse.service;



import com.example.E_comerse.dto.request.CategoryRequest;
import com.example.E_comerse.dto.response.CategoryResponse;
import com.example.E_comerse.exception.DataNotFoundException;
import com.example.E_comerse.exception.DuplicateDataException;
import com.example.E_comerse.model.Category;
import com.example.E_comerse.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryResponse> findAll(){
        try {
            return categoryRepository.findAll()
                    // {} menampung object
                    .stream()
                    // {name:...} mapping data name
                    .map(this::convertToResponse)
                    .toList(); // [{}] data array of object
        } catch (Exception e){

            throw new RuntimeException("Failed to get data categories");
        }
    }

    public CategoryResponse create(CategoryRequest categoryRequest){
        try {
            if(categoryRepository.findByName(categoryRequest.getName()).isPresent()){
                throw new DuplicateDataException("Category already exist");
            }
            Category category = new Category();
            category.setName(categoryRequest.getName());
            category = categoryRepository.save(category);
            return convertToResponse(category);
        }catch (DuplicateDataException e){
            throw e; //  error yang dilempat ke controller
        } catch (Exception e){
            throw new RuntimeException("Failed to create category",e);
        }
    }

    public  CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest){
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new DuplicateDataException("Category with id " + id + " not found"));
            if(categoryRepository.findByName(categoryRequest.getName()).isPresent()) {
                throw new DuplicateDataException("Category already exist");
            }
            category.setName(categoryRequest.getName());
            category = categoryRepository.save(category);
            return convertToResponse(category);
        }
        catch (DataNotFoundException | DuplicateDataException e){
            throw e;
        } catch (Exception e){
            throw new RuntimeException("Failed to update category" + e.getMessage(),e );
        }
    };

    public void deleteCategory(Long id){
        try {
            if (!categoryRepository.existsById(id)){
                throw new DataNotFoundException("Category id not Found");
            }
            categoryRepository.deleteById(id);
        } catch (DataNotFoundException e){
            throw e;
        } catch (Exception e){
            throw new RuntimeException("Failed to delete category" + e.getMessage(),e );
        }
    }

    public Optional<CategoryResponse> findByName(String name){
        try {
            return categoryRepository.findByName(name).map(this::convertToResponse);
        }catch (Exception e){
            throw new RuntimeException("Failed to find category by name :"+ e.getMessage());
        }
    }

    private CategoryResponse convertToResponse(Category category){
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        return response;
    }
}
