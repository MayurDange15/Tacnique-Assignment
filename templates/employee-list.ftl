<#list employees as employee>
    <div class="employee-card" data-id="${employee.id}">
        <h3>${employee.firstName} ${employee.lastName}</h3>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Department:</strong> ${employee.department}</p>
        <p><strong>Role:</strong> ${employee.role}</p>
        <div class="employee-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    </div>
</#list>